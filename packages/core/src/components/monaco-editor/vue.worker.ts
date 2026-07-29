// @ts-ignore
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import {
  createJsDelivrFs,
  createJsDelivrUriResolver,
  decorateServiceEnvironment,
  jsDelivrUriBase,
} from '@volar/cdn';
import { VueCompilerOptions, resolveConfig } from '@vue/language-service';
import {
  createLanguageService,
  createLanguageHost,
  createServiceEnvironment,
} from '@volar/monaco/worker';
import { setupTypeAcquisition } from '@typescript/ata';
import type { WorkerHost, WorkerMessage } from './env';

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions;
    vueCompilerOptions?: Partial<VueCompilerOptions>;
  };
  dependencies: Record<string, string>;
}

let locale: string;

let ts: typeof import('typescript');
let tsLocalized: any;

self.onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  if (msg.data?.event === 'init') {
    if (msg.data.tsLocale) {
      locale = msg.data.tsLocale;
    }

    [ts, tsLocalized] = await Promise.all([
      importTsFromCdn(msg.data.tsVersion),
      locale &&
        fetchJson(
          `https://cdn.jsdelivr.net/npm/typescript@${msg.data.tsVersion}/lib/${locale}/diagnosticMessages.generated.json`
        ),
    ]);
    self.postMessage('inited');
    return;
  }

  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext<WorkerHost>,
      { tsconfig, dependencies }: CreateData
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {
          allowImportingTsExtensions: true,
          allowJs: true,
          checkJs: true,
          jsx: 'Preserve',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          target: 'ES6',
        },
        ''
      );
      const env = createServiceEnvironment();
      const host = createLanguageHost(
        ctx.getMirrorModels,
        env,
        '/',
        compilerOptions
      );
      const typeFiles = new Map<string, string>();
      const typeFileDirectories = new Map<string, Map<string, 1 | 2>>();
      let typeFilesVersion = 0;
      const getScriptFileNames = host.getScriptFileNames.bind(host);
      const getScriptSnapshot = host.getScriptSnapshot.bind(host);
      const getProjectVersion = host.getProjectVersion.bind(host);
      host.getScriptFileNames = () => [
        ...getScriptFileNames(),
        ...typeFiles.keys(),
      ];
      host.getScriptSnapshot = (fileName) =>
        getScriptSnapshot(fileName) ??
        (typeFiles.has(fileName)
          ? ts.ScriptSnapshot.fromString(typeFiles.get(fileName)!)
          : undefined);
      host.getProjectVersion = () =>
        `${getProjectVersion()}:${typeFilesVersion}`;
      const jsDelivrFs = createJsDelivrFs(ctx.host.onFetchCdnFile);
      const jsDelivrUriResolver = createJsDelivrUriResolver(
        '/node_modules',
        dependencies
      );

      if (locale) {
        env.locale = locale;
      }
      if (tsLocalized) {
        host.getLocalizedDiagnosticMessages = () => tsLocalized;
      }

      decorateServiceEnvironment(env, jsDelivrUriResolver, jsDelivrFs);
      const fallbackFs = env.fs;
      env.fs = {
        stat(uri) {
          const fileName = env.uriToFileName(uri);
          if (typeFiles.has(fileName)) {
            return { type: 1, size: -1, ctime: -1, mtime: -1 };
          }
          if (hasTypeFileInDirectory(fileName)) {
            return { type: 2, size: -1, ctime: -1, mtime: -1 };
          }
          return fallbackFs?.stat(uri);
        },
        readFile(uri) {
          const fileName = env.uriToFileName(uri);
          return typeFiles.get(fileName) ?? fallbackFs?.readFile(uri);
        },
        readDirectory(uri) {
          const fileName = env.uriToFileName(uri);
          const entries = readTypeFileDirectory(fileName);
          return entries.length
            ? entries
            : fallbackFs?.readDirectory(uri) ?? [];
        },
      };

      const languageService = createLanguageService(
        { typescript: ts as any },
        env,
        resolveConfig(
          {},
          compilerOptions,
          tsconfig.vueCompilerOptions || {},
          ts as any
        ),
        host
      );
      let acquire = createTypeAcquisition();
      let acquisitionRun = Promise.resolve();
      const packageTypeAvailability = new Map<string, Promise<boolean>>();

      return Object.assign(languageService, {
        acquireTypes(source: string) {
          acquisitionRun = acquisitionRun
            .then(async () => {
              const previousFileCount = typeFiles.size;
              const packages = await getPackagesWithoutTypes(source);
              if (packages.length) {
                await acquire(
                  packages.map((name) => `import '${name}';`).join('\n')
                );
              }
              if (typeFiles.size > previousFileCount) {
                typeFilesVersion++;
              }
            })
            .catch((error) => {
              console.warn(
                '[codeplayer] Automatic type acquisition failed',
                error
              );
              acquire = createTypeAcquisition();
            });
          return acquisitionRun;
        },
      });

      function createTypeAcquisition() {
        return setupTypeAcquisition({
          projectName: 'codeplayer',
          typescript: ts,
          delegate: {
            receivedFile(code, path) {
              addTypeFile(path, code);
            },
            errorMessage(message, error) {
              console.warn(`[codeplayer] ${message}`, error);
            },
          },
        });
      }

      function hasTypeFileInDirectory(directory: string) {
        return typeFileDirectories.has(normalizeDirectory(directory));
      }

      function readTypeFileDirectory(directory: string) {
        return Array.from(
          typeFileDirectories.get(normalizeDirectory(directory)) ?? []
        );
      }

      function addTypeFile(path: string, code: string) {
        typeFiles.set(path, code);
        let current = path;
        while (current !== '/') {
          const separator = current.lastIndexOf('/');
          const parent = separator > 0 ? current.slice(0, separator) : '/';
          const name = current.slice(separator + 1);
          let entries = typeFileDirectories.get(parent);
          if (!entries) {
            entries = new Map();
            typeFileDirectories.set(parent, entries);
          }
          entries.set(name, current === path ? 1 : 2);
          current = parent;
        }
      }

      function normalizeDirectory(directory: string) {
        return directory.length > 1 && directory.endsWith('/')
          ? directory.slice(0, -1)
          : directory;
      }

      async function getPackagesWithoutTypes(source: string) {
        const packages = Array.from(
          new Set(
            ts
              .preProcessFile(source)
              .importedFiles.map(({ fileName }) => getPackageName(fileName))
              .filter((name): name is string => !!name)
          )
        );
        const typeAvailability = await Promise.all(
          packages.map((name) => packageHasTypes(name))
        );
        return packages.filter((_, index) => !typeAvailability[index]);
      }

      function packageHasTypes(packageName: string) {
        let result = packageTypeAvailability.get(packageName);
        if (!result) {
          result = fetch(
            `${jsDelivrUriBase}/${packageName}@latest/package.json`
          )
            .then(async (response) => {
              if (!response.ok) return false;
              const packageJson = await response.json();
              return !!(
                packageJson.types ||
                packageJson.typings ||
                JSON.stringify(packageJson.exports)?.includes('"types"')
              );
            })
            .catch(() => false);
          packageTypeAvailability.set(packageName, result);
        }
        return result;
      }

      function getPackageName(moduleName: string) {
        if (
          moduleName.startsWith('.') ||
          moduleName.startsWith('/') ||
          /^[a-z]+:/i.test(moduleName)
        ) {
          return;
        }
        const parts = moduleName.split('/');
        return moduleName.startsWith('@')
          ? parts.slice(0, 2).join('/')
          : parts[0];
      }
    }
  );
};

async function importTsFromCdn(tsVersion: string) {
  const _module = globalThis.module;
  (globalThis as any).module = { exports: {} };
  const tsUrl = `https://cdn.jsdelivr.net/npm/typescript@${tsVersion}/lib/typescript.js`;
  await import(/* @vite-ignore */ tsUrl);
  const ts = globalThis.module.exports;
  globalThis.module = _module;
  return ts as typeof import('typescript');
}

async function fetchJson<T>(url: string) {
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      return await res.json();
    }
  } catch {
    // ignore
  }
}
