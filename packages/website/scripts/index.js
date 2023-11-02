const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve(__dirname, '../dist'); // 指定要遍历的目录

function replaceTextInFile(filePath, search, replace) {
  let data = fs.readFileSync(filePath, 'utf8');
  while (data.includes(search)) {
    data = data.replace(search, replace);
  }
  // 写入更新后的内容回到文件
  fs.writeFileSync(filePath, data, 'utf8');
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // 递归遍历子目录
      traverseDirectory(filePath);
    } else {
      // 处理文件中的文本替换
      replaceTextInFile(
        filePath,
        `""+new URL(`,
        `URL.createObjectURL(new Blob(['importScripts(`
      );
      replaceTextInFile(
        filePath,
        ',self.location).href',
        `);'],{type:"text/javascript"}))`
      );
    }
  });
}

traverseDirectory(directoryPath);
