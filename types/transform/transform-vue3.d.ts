import { File } from '../utils';
export declare const transformVue3: (result: {
    errors: (string | Error)[];
}, { filename, code, compiled }: File) => Promise<void>;
