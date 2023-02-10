import './components';
import './style.less';

export type Controls =
  | 'header'
  | 'files'
  | 'codeEditor'
  | 'webPreview'
  | 'refresh'
  | 'layout'
  | 'share';

export type ToolbarPosition = 'top' | 'bottom';

export interface CodeSandboxOptions {
  /**
   * @description_en The fixed height of the component. When this item is not set, the component height automatically changes with the content
   * @description_zh 组件的固定高度，不设置此项时组件高度随内容自动变化
   */
  height?: number;
  /**
   * @description_en Whether to display the side file column, default value is true
   * @description_zh 是否展示侧文件栏，默认为 true
   */
  showFiles?: boolean;
  /**
   * @description_en Whether to display the code editor, default value is true
   * @description_zh 是否展示代码编辑区，默认为 true
   */
  showCodeEditor?: boolean;
  /**
   * @description_en Whether to display the web preview, default value is true
   * @description_zh 是否展示 web 可视区，默认为 true
   */
  showWebPreview?: boolean;
  /**
   * @description_en Whether to display the toolbar, default value is true
   * @description_zh 是否展示工具栏，默认为 true
   */
  showToolbar?: boolean;
  /**
   * @description_en Entry file name
   * @description_zh 入口文件名称
   */
  mainFile?: string;
  /**
   * @description_en Initialization files JSON string, format: Record<filename, code>
   * @description_zh 初始化文件 JSON 字符串，格式为：Record<filename, code>
   */
  initFiles?: Record<string, string>;
  /**
   * @description_en Dependent npm package, format: Record<package name, link>
   * @description_zh 依赖的 npm 包，格式为：Record<package name, link>
   */
  imports?: Record<string, string>;
  /**
   * @description_en Application type. If initFiles is not configured, the initial file will be automatically generated according to the appType; If initFiles is configured, this item is invalid
   * @description_zh 应用类型。若未配置 initFiles，会根据 appType 自动生成初始文件；若配置了 initFiles，此项失效
   */
  appType?: 'vue' | 'vue3' | 'react' | 'html' | 'javascript' | 'typescript';
  /**
   * @description_en Control buttons to be removed from the toolbar
   * @description_zh 工具栏要移除的工具按钮
   */
  excludeTools?: Controls[];
  /**
   * @description_en Whether or not CodeEditor and WebPreview's layout are vertical. Default value is false
   * @description_zh 代码编辑区-web预览区是否垂直布局。默认值为左右布局
   */
  vertical?: boolean;
  /**
   * @description_en Whether or not reversing CodeEditor and WebPreview's position. Default value is false
   * @description_zh 代码编辑区-web预览区是否位置翻转。默认值为不翻转
   */
  reverse?: boolean;
  /**
   * @description_en Toolbar's position. Default value is top
   * @description_zh 工具栏位置，默认值为 top
   */
  toolbarPosition?: ToolbarPosition;
  /**
   * @description_en string of styleSheet
   * @description_zh Css styleSheet 字符串
   */
  css?: string;
}

export default class CodeSandbox {
  constructor(el: HTMLElement | string, options: CodeSandboxOptions) {
    const container = typeof el === 'string' ? document.querySelector(el) : el;
    const codeSandbox = document.createElement('code-sandbox');
    codeSandbox.options = options;
    codeSandbox.height = options.height as number;
    container?.append(codeSandbox);
  }
}
