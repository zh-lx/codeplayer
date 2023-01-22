import { LitElement, PropertyValueMap } from 'lit';
export declare class CodeSandboxSplitter extends LitElement {
    vertical: boolean;
    initialSplit: string;
    min: string;
    max: string;
    closable: boolean;
    split: string;
    isDrag: boolean;
    startPosition: number;
    startSplit: number;
    showMask: boolean;
    maps: {
        left: {};
        right: {};
    };
    splitterContainer: HTMLDivElement;
    firstUpdated(): void;
    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    getContainerLength(): number;
    computedSplitBound(): number;
    dragStart: (e: MouseEvent) => void;
    dragMove: (e: MouseEvent) => void;
    dragEnd: () => void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'code-sandbox-splitter': CodeSandboxSplitter;
    }
}
