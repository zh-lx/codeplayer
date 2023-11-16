export type Control = 'refresh' | 'copy' | 'share' | 'docs' | 'github';

export type AppType =
  | 'vue'
  | 'vue2'
  | 'vue3'
  | 'react'
  | 'html'
  | 'javascript'
  | 'js'
  | 'typescript'
  | 'ts';

export interface CodePlayerOptions {
  /**
   * @description_en Whether to display the side file column, default value is true
   * @description_zh 是否展示侧文件栏，默认为 true
   */
  showFileBar?: boolean;
  /**
   * @description_en Whether to display the code editor, default value is true
   * @description_zh 是否展示代码编辑区，默认为 true
   */
  showCode?: boolean;
  /**
   * @description_en Whether to display the web preview, default value is true
   * @description_zh 是否展示 web 可视区，默认为 true
   */
  showPreview?: boolean;
  /**
   * @description_en Whether to display the toolbar, default value is true
   * @description_zh 是否展示工具栏，默认为 true
   */
  showToolbar?: boolean;
  /**
   * @description_en Entry file name
   * @description_zh 入口文件的文件名，若不设置，默认将第一个文件作为入口文件
   */
  entry?: string;
  /**
   * @description_en Entry file name
   * @description_zh 初始化展示代码的文件的文件名
   */
  activeFile?: string;
  /**
   * @description_en Initialization files JSON string, format: Record<filename, code>
   * @description_zh 初始化文件 map，格式为：Record<filename, code>
   */
  initFiles?: Record<string, string>;
  /**
   * @description_en Application type. If initFiles is not configured, the initial file will be automatically generated according to the appType; If initFiles is configured, this item is invalid
   * @description_zh 应用类型。若未配置 initFiles，会根据 appType 自动生成初始文件；若配置了 initFiles，此项失效
   */
  appType?:
    | 'vue'
    | 'vue2'
    | 'vue3'
    | 'react'
    | 'html'
    | 'javascript'
    | 'js'
    | 'typescript'
    | 'ts';
  /**
   * @description_en Control buttons to be removed from the toolbar
   * @description_zh 工具栏要移除的工具按钮
   */
  excludeTools?: Control[];
  /**
   * @description_en The initial font-size of code
   * @description_zh 初始的代码字号
   */
  codeSize?: number;
  /**
   * @description_en The version of vue compiler
   * @description_zh vue 解析器的版本
   */
  vueVersion?: 2 | 3;
  /**
   * @description_en The theme
   * @description_zh 主题
   */
  theme?: 'light' | 'dark';
  /**
   * @description_en Whether to open the console
   * @description_zh 是否默认打开控制台
   */
  openConsole?: boolean;
  /**
   * @description_en Whether to show the eruda
   * @description_zh 是否展示 eruda
   */
  showEruda?: boolean;
}
