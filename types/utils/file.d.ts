export declare class File {
    filename: string;
    code: string;
    hidden: boolean;
    compiled: {
        js: string;
        css: string;
    };
    constructor(filename: string, code?: string, hidden?: boolean);
}
export declare const getTemplate: (appType: string) => {
    'App.vue': string;
    "import-map.json": string;
} | {
    'App.tsx': string;
    "import-map.json": string;
} | {
    'index.html': string;
    "import-map.json": string;
} | {
    'index.js': string;
    "import-map.json": string;
} | {
    'index.ts': string;
    "import-map.json": string;
};
