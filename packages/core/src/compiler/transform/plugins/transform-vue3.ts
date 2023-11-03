import hashId from 'hash-sum';
import { COMP_IDENTIFIER } from '@/constant';
import { transform } from 'sucrase';
import {
  SFCDescriptor,
  BindingMetadata,
  CompilerOptions,
  parse,
  compileStyleAsync,
  compileScript,
  compileTemplate,
  rewriteDefault,
} from '@vue/compiler-sfc';
import less from 'less';
import { compileString as compileSassString } from 'sass';
import { Hooks, ComplierPluginParams } from '@/compiler/type';

export const transformVue3 = async (
  params: ComplierPluginParams
): Promise<Error[] | undefined> => {
  const { fileMap } = params;
  const files = Object.keys(fileMap).map((filename) => fileMap[filename]);
  const _errors: Error[] = [];

  await Promise.all(
    files
      .filter(({ filename }) => filename.endsWith('.vue'))
      .map(async (file) => {
        const { filename, code, compiled } = file;

        const id = hashId(filename);

        const { errors, descriptor } = parse(code, {
          filename,
          sourceMap: true,
        });

        if (errors.length) {
          _errors.push(...errors);
          return;
        }

        const scriptLang =
          (descriptor.script && descriptor.script.lang) ||
          (descriptor.scriptSetup && descriptor.scriptSetup.lang);
        const isTS = scriptLang === 'ts';

        if (scriptLang && !isTS) {
          _errors.push(
            new Error(`Only lang="ts" is supported for <script> blocks.`)
          );
          return;
        }

        const hasScoped = descriptor.styles.some((s) => s.scoped);
        let clientCode = '';

        const appendSharedCode = (code: string) => {
          clientCode += code;
        };

        // script
        const clientScriptResult = await doCompileScript(descriptor, id, isTS);
        if (!clientScriptResult) {
          return;
        }
        const [clientScript, bindings, scriptErrors] = clientScriptResult;
        if (scriptErrors) {
          _errors.push(...scriptErrors);
          return;
        }
        clientCode += clientScript;

        // template
        if (descriptor.template && !descriptor.scriptSetup) {
          const [code, templateErrors] = await doCompileTemplate(
            descriptor,
            id,
            bindings,
            isTS
          );
          if (templateErrors) {
            _errors.push(...templateErrors);
            return;
          }
          clientCode += code;
        }

        if (hasScoped) {
          appendSharedCode(
            `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`
          );
        }

        if (clientCode) {
          appendSharedCode(
            `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
              `\nexport default ${COMP_IDENTIFIER}`
          );
          compiled.js = clientCode.trim();
        }

        // css 处理
        let [css, styleErrors] = await doCompileStyle(descriptor, id, filename);
        if (styleErrors) {
          _errors.push(...styleErrors);
          return;
        }
        if (css) {
          compiled.css = css.trim();
        } else {
          compiled.css = '/* No <style> tags present */';
        }
      })
  );

  return _errors.length ? _errors : undefined;
};

async function doCompileStyle(
  descriptor: SFCDescriptor,
  id: string,
  filename: string
): Promise<[string, Error[] | null]> {
  // styles
  let css = '';

  for (const style of descriptor.styles) {
    if (style.module) {
      return [
        '',
        [new Error(`<style module> is not supported in the playground.`)],
      ];
    }

    let source = style.content;
    const errors = [];

    if (style.lang === 'less') {
      try {
        source = (await less.render(source)).css;
      } catch (error) {
        errors.push(new Error(String(error)));
      }
    } else if (style.lang === 'scss' || style.lang === 'sass') {
      try {
        source = (await compileSassString(source)).css;
      } catch (error) {
        errors.push(new Error(String(error)));
      }
    }

    const styleResult = await compileStyleAsync({
      // ...vue3SFCOptions?.style,
      source: style.content,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    });

    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
        return ['', errors];
      }
      // proceed even if css compile errors
    } else {
      css += styleResult.code + '\n';
    }
  }

  return [css, null];
}

async function doCompileScript(
  descriptor: SFCDescriptor,
  id: string,
  isTS: boolean
): Promise<[string, BindingMetadata | undefined, Error[] | null] | undefined> {
  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang);

  if (scriptLang && !isTS && scriptLang !== 'js') {
    return [
      '',
      undefined,
      [
        new Error(
          `Only lang="ts" or lang="js" is supported for <script> blocks.`
        ),
      ],
    ];
  }

  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
        ? ['typescript', 'jsx']
        : undefined;
      const compiledScript = compileScript(descriptor, {
        inlineTemplate: true,
        // ...vue3SFCOptions?.script,
        id,
        templateOptions: {
          // ...vue3SFCOptions?.template,
          ssr: false,
          compilerOptions: {
            // ...vue3SFCOptions?.template?.compilerOptions,
            expressionPlugins,
          },
        },
      });
      let code = '';
      if (compiledScript.bindings) {
        code += `\n/* Analyzed bindings: ${JSON.stringify(
          compiledScript.bindings,
          null,
          2
        )} */`;
      }
      code +=
        `\n` +
        rewriteDefault(
          compiledScript.content,
          COMP_IDENTIFIER,
          expressionPlugins
        );

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
        code = await transform(code, {
          transforms: ['typescript'],
        }).code;
      }

      return [code, compiledScript.bindings, null];
    } catch (e: any) {
      return ['', undefined, [e.stack.split('\n').slice(0, 12).join('\n')]];
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined, null];
  }
}

async function doCompileTemplate(
  descriptor: SFCDescriptor,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  isTS: boolean
): Promise<[string, Error[] | null]> {
  const templateResult = compileTemplate({
    // ...vue3SFCOptions?.template,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    ssr: false,
    isProd: false,
    compilerOptions: {
      // ...vue3SFCOptions?.template?.compilerOptions,
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined,
    },
  });
  if (templateResult.errors.length) {
    return ['', templateResult.errors as Error[]];
  }

  const fnName = 'render';

  let code =
    `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`;

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts') {
    code = await transform(code, {
      transforms: ['typescript'],
    }).code;
  }

  return [code, null];
}

export default function (hooks: Hooks) {
  hooks.hook('transform', transformVue3);
}
