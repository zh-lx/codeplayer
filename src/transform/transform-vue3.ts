import { Store } from '../core/store';
import { File } from '../core/file';
import hashId from 'hash-sum';
import { COMP_IDENTIFIER } from '../constant';
import {
  SFCDescriptor,
  BindingMetadata,
  CompilerOptions,
} from '@vue/compiler-sfc';
import { transformTS } from './transform-ts';

export const transformVue3 = async (
  store: Store,
  { filename, code, compiled }: File
) => {
  const id = hashId(filename);
  const { errors, descriptor } = store.compiler.parse(code, {
    filename,
    sourceMap: true,
  });
  if (errors.length) {
    store.state.errors = errors;
    return;
  }

  if (
    descriptor.styles.some((s) => s.lang) ||
    (descriptor.template && descriptor.template.lang)
  ) {
    store.state.errors = [
      `lang="x" pre-processors for <template> or <style> are currently not ` +
        `supported.`,
    ];
    return;
  }

  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang);
  const isTS = scriptLang === 'ts';
  if (scriptLang && !isTS) {
    store.state.errors = [`Only lang="ts" is supported for <script> blocks.`];
    return;
  }

  const hasScoped = descriptor.styles.some((s) => s.scoped);
  let clientCode = '';

  const appendSharedCode = (code: string) => {
    clientCode += code;
  };

  const clientScriptResult = await doCompileScript(store, descriptor, id, isTS);
  if (!clientScriptResult) {
    return;
  }
  const [clientScript, bindings] = clientScriptResult;
  clientCode += clientScript;

  if (
    descriptor.template &&
    (!descriptor.scriptSetup ||
      store.vue3SFCOptions?.script?.inlineTemplate === false)
  ) {
    const clientTemplateResult = await doCompileTemplate(
      store,
      descriptor,
      id,
      bindings,
      isTS
    );
    if (!clientTemplateResult) {
      return;
    }
    clientCode += clientTemplateResult;
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
    compiled.js = clientCode.trimStart();
  }

  // styles
  let css = '';
  for (const style of descriptor.styles) {
    if (style.module) {
      store.state.errors = [
        `<style module> is not supported in the playground.`,
      ];
      return;
    }

    const styleResult = await store.compiler.compileStyleAsync({
      ...store.vue3SFCOptions?.style,
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
        store.state.errors = styleResult.errors;
      }
      // proceed even if css compile errors
    } else {
      css += styleResult.code + '\n';
    }
  }
  if (css) {
    compiled.css = css.trim();
  } else {
    compiled.css = '/* No <style> tags present */';
  }

  // clear errors
  store.state.errors = [];
};

async function doCompileScript(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  isTS: boolean
): Promise<[string, BindingMetadata | undefined] | undefined> {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
        ? ['typescript', 'jsx']
        : undefined;
      const compiledScript = store.compiler.compileScript(descriptor, {
        inlineTemplate: true,
        ...store.vue3SFCOptions?.script,
        id,
        templateOptions: {
          ...store.vue3SFCOptions?.template,
          ssr: false,
          compilerOptions: {
            ...store.vue3SFCOptions?.template?.compilerOptions,
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
        store.compiler.rewriteDefault(
          compiledScript.content,
          COMP_IDENTIFIER,
          expressionPlugins
        );

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
        code = await transformTS(code);
      }

      return [code, compiledScript.bindings];
    } catch (e: any) {
      store.state.errors = [e.stack.split('\n').slice(0, 12).join('\n')];
      return;
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined];
  }
}

async function doCompileTemplate(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  isTS: boolean
) {
  const templateResult = store.compiler.compileTemplate({
    ...store.vue3SFCOptions?.template,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    ssr: false,
    isProd: false,
    compilerOptions: {
      ...store.vue3SFCOptions?.template?.compilerOptions,
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined,
    },
  });
  if (templateResult.errors.length) {
    store.state.errors = templateResult.errors;
    return;
  }

  const fnName = 'render';

  let code =
    `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`;

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts') {
    code = await transformTS(code);
  }

  return code;
}
