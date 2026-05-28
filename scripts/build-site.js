const { spawnSync } = require('node:child_process');

const env = {
  ...process.env,
  BROWSERSLIST_IGNORE_OLD_DATA: process.env.BROWSERSLIST_IGNORE_OLD_DATA || '1',
};

function run(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: 'inherit',
    env,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run(require.resolve('tailwindcss/lib/cli.js'), ['-i', './css/tailwind.css', '-o', './css/tw.css', '--minify']);
run(require.resolve('@11ty/eleventy/cmd.js'));