const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve(__dirname, '../dist'); // 指定要遍历的目录

function replaceTextInFile(filePath, search, replace) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`);
      return;
    }

    let updatedData = data;
    while (updatedData.includes(search)) {
      updatedData = updatedData.replace(search, replace);
    }

    // 写入更新后的内容回到文件
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${filePath}`);
      }
    });
  });
}

function traverseDirectory(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${dir}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(`Error checking file: ${filePath}`);
          return;
        }

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
    });
  });
}

traverseDirectory(directoryPath);
