import type { File, ComplierPluginParams } from '@/compiler';
import {
  babelParse,
  MagicString,
  walk,
  walkIdentifiers,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty,
} from '@vue/compiler-sfc';
import type { ExportSpecifier, Identifier, Node } from '@babel/types';
import {
  modulesKey,
  exportKey,
  dynamicImportKey,
  moduleKey,
  scriptModuleRE,
  styleRE,
} from '@/constant';
import { extensions } from '@/constant';

export async function compileModulesForPreview(params: ComplierPluginParams) {
  const { fileMap: files, entry: entry } = params;
  const seen = new Set<File>();
  const modules: string[] = [];
  const styles: string[] = [];
  const links: string[] = [];
  const html: string[] = [];
  processFile({
    files,
    file: files[entry],
    modules,
    styles,
    links,
    seen,
    html,
  });

  return { modules, styles, links, html };
}

// similar logic with Vite's SSR transform, except this is targeting the browser
function processFile(params: {
  files: Record<string, File>;
  file: File;
  modules: string[];
  styles: string[];
  links: string[];
  seen: Set<File>;
  html: string[];
}) {
  const { files, file, modules, styles, links, seen, html } = params;
  if (seen.has(file)) {
    return [];
  }
  seen.add(file);

  if (file.filename.endsWith('.html')) {
    return processHtmlFile({
      files,
      src: file.code,
      filename: file.filename,
      modules,
      styles,
      links,
      seen,
      html,
    });
  }

  let [js, importedFiles, _links] = processModule(
    files,
    file.compiled.js,
    file.filename
  );
  // append css
  if (file.compiled.css) {
    styles.push(file.compiled.css);
  }
  // crawl child imports
  if (importedFiles.size) {
    for (const imported of importedFiles) {
      processFile({
        files,
        file: files[imported],
        modules,
        styles,
        links,
        seen,
        html,
      });
    }
  }
  // push self
  modules.push(js);
  links.push(..._links);
}

function getFileWithoutExt(filename: string, files: Record<string, File>) {
  if (!(filename in files)) {
    const ext = extensions.find((ext) =>
      Object.keys(files).some((name) => name === filename + ext)
    );
    if (ext) {
      filename += ext;
    } else {
      throw new Error(`File "${filename}" does not exist.`);
    }
  }
  return filename;
}

function processModule(
  files: Record<string, File>,
  src: string,
  filename: string
): [string, Set<string>, string[]] {
  const s = new MagicString(src);
  const links: string[] = [];

  filename = getFileWithoutExt(filename, files);

  const ast = babelParse(src, {
    sourceFilename: filename,
    sourceType: 'module',
  }).program.body;

  const idToImportMap = new Map<string, string>();
  const declaredConst = new Set<string>();
  const importedFiles = new Set<string>();
  const importToIdMap = new Map<string, string>();

  function defineImport(node: Node, source: string) {
    let filename = source.replace(/^\.\/+/, '');
    filename = getFileWithoutExt(filename, files);
    if (!(filename in files)) {
      throw new Error(`File "${filename}" does not exist.`);
    }
    if (importedFiles.has(filename)) {
      return importToIdMap.get(filename)!;
    }
    importedFiles.add(filename);
    const id = `__import_${importedFiles.size}__`;
    importToIdMap.set(filename, id);
    s.appendLeft(node.start!, `const ${id} = ${modulesKey}["${filename}"]\n`);
    return id;
  }

  function defineExport(name: string, local = name) {
    s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`);
  }

  // 0. instantiate module
  s.prepend(`const ${moduleKey} = ${modulesKey}["${filename}"] = {}\n`);

  // 1. check all import statements and record id -> importName map
  for (const node of ast) {
    // import foo from 'foo' --> foo = __import_foo__.default
    // import { baz } from 'foo' --> baz = __import_foo__.baz
    // import * as ok from 'foo' --> ok = __import_foo__
    if (node.type === 'ImportDeclaration') {
      const source = node.source.value;
      if (source.startsWith('./')) {
        const importId = defineImport(node, node.source.value);
        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier') {
            idToImportMap.set(
              spec.local.name,
              `${importId}.${(spec.imported as Identifier).name}`
            );
          } else if (spec.type === 'ImportDefaultSpecifier') {
            idToImportMap.set(spec.local.name, `${importId}.default`);
          } else {
            // namespace specifier
            idToImportMap.set(spec.local.name, importId);
          }
        }
        s.remove(node.start!, node.end!);
      } else if (source.endsWith('.css')) {
        s.overwrite(node.start!, node.end!, '');
        links.push(source);
      }
    }
  }

  // 2. check all export statements and define exports
  for (const node of ast) {
    // named exports
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (
          node.declaration.type === 'FunctionDeclaration' ||
          node.declaration.type === 'ClassDeclaration'
        ) {
          // export function foo() {}
          defineExport(node.declaration.id!.name);
        } else if (node.declaration.type === 'VariableDeclaration') {
          // export const foo = 1, bar = 2
          for (const decl of node.declaration.declarations) {
            for (const id of extractIdentifiers(decl.id)) {
              defineExport(id.name);
            }
          }
        }
        s.remove(node.start!, node.declaration.start!);
      } else if (node.source) {
        // export { foo, bar } from './foo'
        const importId = defineImport(node, node.source.value);
        for (const spec of node.specifiers) {
          defineExport(
            (spec.exported as Identifier).name,
            `${importId}.${(spec as ExportSpecifier).local.name}`
          );
        }
        s.remove(node.start!, node.end!);
      } else {
        // export { foo, bar }
        for (const spec of node.specifiers) {
          const local = (spec as ExportSpecifier).local.name;
          const binding = idToImportMap.get(local);
          defineExport((spec.exported as Identifier).name, binding || local);
        }
        s.remove(node.start!, node.end!);
      }
    }

    // default export
    if (node.type === 'ExportDefaultDeclaration') {
      if ('id' in node.declaration && node.declaration.id) {
        // named hoistable/class exports
        // export default function foo() {}
        // export default class A {}
        const { name } = node.declaration.id;
        s.remove(node.start!, node.start! + 15);
        s.append(`\n${exportKey}(${moduleKey}, "default", () => ${name})`);
      } else {
        // anonymous default exports
        s.overwrite(node.start!, node.start! + 14, `${moduleKey}.default =`);
      }
    }

    // export * from './foo'
    if (node.type === 'ExportAllDeclaration') {
      const importId = defineImport(node, node.source.value);
      s.remove(node.start!, node.end!);
      s.append(`\nfor (const key in ${importId}) {
        if (key !== 'default') {
          ${exportKey}(${moduleKey}, key, () => ${importId}[key])
        }
      }`);
    }
  }

  // 3. convert references to import bindings
  for (const node of ast) {
    if (node.type === 'ImportDeclaration') continue;
    walkIdentifiers(node, (id, parent, parentStack) => {
      const binding = idToImportMap.get(id.name);
      if (!binding) {
        return;
      }
      if (isStaticProperty(parent) && parent.shorthand) {
        // let binding used in a property shorthand
        // { foo } -> { foo: __import_x__.foo }
        // skip for destructure patterns
        if (
          !(parent as any).inPattern ||
          isInDestructureAssignment(parent, parentStack)
        ) {
          s.appendLeft(id.end!, `: ${binding}`);
        }
      } else if (
        parent.type === 'ClassDeclaration' &&
        id === parent.superClass
      ) {
        if (!declaredConst.has(id.name)) {
          declaredConst.add(id.name);
          // locate the top-most node containing the class declaration
          const topNode = parentStack[1];
          s.prependRight(topNode.start!, `const ${id.name} = ${binding};\n`);
        }
      } else {
        s.overwrite(id.start!, id.end!, binding);
      }
    });
  }

  // 4. convert dynamic imports
  (walk as any)(ast, {
    enter(node: Node, parent: Node) {
      if (node.type === 'Import' && parent.type === 'CallExpression') {
        const arg = parent.arguments[0];
        if (arg.type === 'StringLiteral' && arg.value.startsWith('./')) {
          s.overwrite(node.start!, node.start! + 6, dynamicImportKey);
          s.overwrite(
            arg.start!,
            arg.end!,
            JSON.stringify(arg.value.replace(/^\.\/+/, ''))
          );
        }
      }
    },
  });

  return [s.toString(), importedFiles, links];
}

function processHtmlFile(params: {
  files: Record<string, File>;
  src: string;
  filename: string;
  modules: string[];
  styles: string[];
  links: string[];
  seen: Set<File>;
  html: string[];
}) {
  const { files, src, filename, modules, styles, links, seen, html } = params;
  const deps: string[] = [];
  let jsCode = '';
  const result = src
    .replace(scriptModuleRE, (_, content) => {
      const [code, importedFiles] = processModule(files, content, filename);
      if (importedFiles.size) {
        for (const imported of importedFiles) {
          processFile({
            files,
            file: files[imported],
            modules: deps,
            styles,
            links,
            seen,
            html,
          });
        }
      }
      jsCode += '\n' + code;
      return '';
    })
    .replace(styleRE, (_, content) => {
      styles.push(`\n${content}\n`);
      return '';
    });
  html.push(result);
  modules.push(...deps);
  modules.push(jsCode);
}
