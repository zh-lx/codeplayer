import { LitElement, PropertyValueMap } from 'lit';
import '@/components/editor';
import '@/components/iframe';
import '@/components/splitter';
import '@/components/files';
import { File } from '@/utils';
export interface Options {
    mainFile?: string;
    serializedState?: string;
    initFiles?: Record<string, string>;
    imports?: Record<string, string>;
    appType?: 'vue' | 'react' | 'html' | 'javascript' | 'typescript';
}
export declare class CodeSandbox extends LitElement {
    constructor();
    height: number;
    options: Options;
    mainFile: string;
    files: Record<string, File>;
    activeFile: File;
    codeSandboxIframeRef: any;
    _initializeOptions(): void;
    setActive(filename: string): void;
    setCode(code: string): void;
    editFilename(newFilename: string, oldFilename: string): void;
    deleteFile(filename: string): void;
    resetHomeFile(filename: string): void;
    emitMethod(e: CustomEventInit): any;
    renderSandbox(): void;
    protected willUpdate(_changedProperties: PropertyValueMap<this>): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'code-sandbox': CodeSandbox;
    }
}
