import { File } from '../utils/file';
export declare const compileFile: (result: {
    errors: (string | Error)[];
}, { filename, code, compiled }: File) => Promise<void>;
