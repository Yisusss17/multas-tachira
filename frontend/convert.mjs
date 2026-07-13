import fs from 'fs/promises';
import path from 'path';
import babel from '@babel/core';
import prettier from 'prettier';

async function main() {
  const adminDir = path.resolve('./src/admin');
  const dirents = await fs.readdir(adminDir, { recursive: true, withFileTypes: true });
  
  const files = dirents
    .filter(dirent => dirent.isFile() && (dirent.name.endsWith('.ts') || dirent.name.endsWith('.tsx')))
    .map(dirent => path.join(dirent.path || dirent.parentPath, dirent.name));

  console.log(`Found ${files.length} files to convert.`);

  for (const file of files) {
    if (file.endsWith('.d.ts')) {
       console.log(`Deleting declaration file: ${file}`);
       await fs.unlink(file);
       continue;
    }

    try {
      const isTsx = file.endsWith('.tsx');
      const code = await fs.readFile(file, 'utf8');

      const transformed = await babel.transformAsync(code, {
        filename: file,
        presets: [
          ['@babel/preset-typescript', { isTSX: isTsx, allExtensions: true }]
        ],
        retainLines: true,
      });

      if (!transformed || transformed.code == null) {
        console.error(`Failed to transform ${file}`);
        continue;
      }

      const prettierConfig = (await prettier.resolveConfig(file)) || {};
      prettierConfig.parser = 'babel';
      prettierConfig.singleQuote = true;

      const formatted = await prettier.format(transformed.code, prettierConfig);

      const ext = isTsx ? '.jsx' : '.js';
      const newFile = file.replace(/\.tsx?$/, ext);

      await fs.writeFile(newFile, formatted);
      await fs.unlink(file);
      console.log(`Converted: ${path.basename(file)} -> ${path.basename(newFile)}`);

    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

main().catch(console.error);
