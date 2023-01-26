import './components';
export declare type Controls = 'header' | 'files' | 'codeEditor' | 'webPreview' | 'refresh';
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
     * @description_en Whether to display the header, default value is true
     * @description_zh 是否展示顶栏控制区，默认为 true
     */
    showHeader?: boolean;
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
    appType?: 'vue' | 'react' | 'html' | 'javascript' | 'typescript';
    /**
     * @description_en Control buttons to be removed from the top header
     * @description_zh 顶部控制区要移除的控制按钮
     */
    excludeControls?: Controls[];
}
export default class CodeSandbox {
    constructor(el: HTMLElement | string, options: CodeSandboxOptions);
}
