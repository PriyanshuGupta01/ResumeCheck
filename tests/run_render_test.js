import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(path.join(__dirname, '../frontend/package.json'));
const esbuild = require('esbuild');

async function buildAndRun() {
  const outfile = path.join(__dirname, '../frontend/dist_test_render.mjs');
  console.log('Bundling test with esbuild...');

  await esbuild.build({
    entryPoints: [path.join(__dirname, 'test_results_render.jsx')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    packages: 'external',
    outfile: outfile,
    loader: {
      '.jsx': 'jsx',
      '.js': 'jsx',
    },
  });

  console.log('Running bundled test with Node...');
  const result = spawnSync('node', [outfile], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../frontend'),
  });
  process.exit(result.status || 0);
}

buildAndRun().catch((err) => {
  console.error('Build and run failed:', err);
  process.exit(1);
});
