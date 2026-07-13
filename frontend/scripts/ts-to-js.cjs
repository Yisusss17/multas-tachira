#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const ts = require('typescript');

const SRC_DIR = path.resolve(process.cwd(), 'src');
const BACKUP_DIR = path.resolve(process.cwd(), 'ts_backup');

const stats = { found: 0, backedUp: 0, transpiled: 0, skipped: 0, errors: 0 };

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile()) {
      if ((full.endsWith('.ts') || full.endsWith('.tsx')) && !full.endsWith('.d.ts')) {
        await processFile(full);
      }
    }
  }
}

async function processFile(filePath) {
  stats.found++;
  try {
    const rel = path.relative(SRC_DIR, filePath);
    const backupPath = path.join(BACKUP_DIR, rel);
    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    await fs.copyFile(filePath, backupPath);
    stats.backedUp++;

    const source = await fs.readFile(filePath, 'utf8');
    const isTsx = filePath.endsWith('.tsx');

    const compilerOptions = {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2018,
      jsx: isTsx ? ts.JsxEmit.React : ts.JsxEmit.None,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      isolatedModules: true
    };

    const transpile = ts.transpileModule(source, {
      compilerOptions,
      fileName: path.basename(filePath)
    });

    let output = transpile.outputText;

    // Remove full-line `import type ...` statements
    output = output.replace(/^\s*import\s+type[^;]*;?\s*$/gm, '');

    // Remove `type` tokens inside import braces like `import { type Foo } from 'x';`
    output = output.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*(['"][^'" ]+['"]);?/g, (m, inner, from) => {
      const parts = inner.split(',').map(p => p.trim()).filter(Boolean);
      const keep = parts.filter(p => !/^type\b/.test(p));
      if (keep.length === 0) return ''; // remove empty imports
      return `import { ${keep.join(', ')} } from ${from};`;
    });

    // Remove any now-empty imports like `import { } from 'x';`
    output = output.replace(/^\s*import\s*\{\s*\}\s*from\s*['"][^'" ]+['"];?\s*$/gm, '');

    const outExt = isTsx ? '.jsx' : '.js';
    const outPath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + outExt);

    await fs.writeFile(outPath, output, 'utf8');
    stats.transpiled++;
  } catch (err) {
    console.error('Error processing file:', filePath, '\n', err);
    stats.errors++;
  }
}

(async function main() {
  try {
    // Ensure backup dir exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // Confirm src exists
    try {
      const st = await fs.stat(SRC_DIR);
      if (!st.isDirectory()) {
        console.error('Source path exists but is not a directory:', SRC_DIR);
        process.exit(1);
      }
    } catch (e) {
      console.error('Source directory not found:', SRC_DIR);
      process.exit(1);
    }

    await walk(SRC_DIR);

    console.log('Transpile summary:');
    console.log('  Files found:', stats.found);
    console.log('  Backed up:', stats.backedUp);
    console.log('  Transpiled:', stats.transpiled);
    console.log('  Errors:', stats.errors);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
