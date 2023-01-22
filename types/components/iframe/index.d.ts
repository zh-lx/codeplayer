import { LitElement, PropertyValueMap } from 'lit';
import { File } from '@/utils';
export declare class CodeSandboxIframe extends LitElement {
    files: Record<string, File>;
    mainFile: string;
    errors: (string | Error)[];
    iframeRef: HTMLIFrameElement;
    firstUpdated(): void;
    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    compileFiles(): Promise<void>;
    getImportMap(): any;
    renderSandbox(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'code-sandbox-iframe': CodeSandboxIframe;
    }
}
