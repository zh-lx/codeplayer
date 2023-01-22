import type { Options } from './components';
import './components';
interface CodeSandboxOptions extends Options {
    height?: number;
}
export declare const CodeSandbox: (el: HTMLElement | string, options: CodeSandboxOptions) => void;
export {};
