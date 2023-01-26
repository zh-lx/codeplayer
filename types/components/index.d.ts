import { LitElement, PropertyValueMap } from 'lit';
import '@/components/editor';
import '@/components/iframe';
import '@/components/splitter';
import '@/components/files';
import '@/components/header';
import { File } from '@/utils';
import { CodeSandboxOptions } from '../index';
export declare class CodeSandbox extends LitElement {
    constructor();
    height: number;
    options: CodeSandboxOptions;
    customStyle: string;
    mainFile: string;
    files: Record<string, File>;
    activeFile: File;
    _showFiles: boolean;
    _showCode: boolean;
    _showPreview: boolean;
    _showHeader: boolean;
    codeSandboxIframeRef: any;
    _initializeOptions(): void;
    toggle(show: '_showFiles' | '_showCode' | '_showPreview' | '_showHeader'): void;
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
