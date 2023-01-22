import { LitElement } from 'lit';
import { File } from '@/utils';
export declare class CodeSandboxFiles extends LitElement {
    files: Record<string, File>;
    activeFile: File;
    mainFile: string;
    showNewFile: boolean;
    newFilename: string;
    originFilename: string;
    newFileInputRef: HTMLInputElement;
    selectFile(filename: string): void;
    addFile(): void;
    deleteFile(filename: string): void;
    resetHomeFile(filename: string): void;
    handleClickRenameFile(originFilename?: string): Promise<void>;
    editFileName({ target }: {
        target: HTMLInputElement;
    }): void;
    validateFilenameError(filename: string): string | null;
    getIcon(filename: string): any;
    renderFileList: () => unknown;
    renderFilenameInput: () => import("lit-html").TemplateResult<1> | null;
    renderAddFileBtn: () => import("lit-html").TemplateResult<1>;
    renderRenameFileBtn: (filename: string) => import("lit-html").TemplateResult<1>;
    renderDeleteFileBtn: (filename: string) => import("lit-html").TemplateResult<1>;
    renderHomeFileBtn: (filename: string) => import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'code-sandbox-files': CodeSandboxFiles;
    }
}
