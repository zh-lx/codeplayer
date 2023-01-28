import { LitElement, PropertyValueMap } from 'lit';
import { Editor } from 'codemirror';
import { File } from '@/utils';
export declare class CodeEditor extends LitElement {
    editor: Editor;
    activeFile: File;
    _codeEditor: HTMLDivElement;
    firstUpdated(): void;
    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    getCode(): string;
    updateActive(): void;
    createEditor(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
