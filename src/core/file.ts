export class File {
  filename: string;
  code: string;
  hidden: boolean;
  compiled = {
    js: '',
    css: '',
    // ssr: '',
  };

  constructor(filename: string, code = '', hidden = false) {
    this.filename = filename;
    this.code = code;
    this.hidden = hidden;
  }
}
