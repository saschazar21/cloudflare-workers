const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const { merge } = require('webpack-merge');

const baseConfig = require('../../webpack.config');

module.exports = merge(baseConfig, {
  entry: './script/index.ts',
  plugins: [
    new WasmPackPlugin({
      crateDirectory: __dirname,
      extraArgs: '--target bundler',
    }),
  ],
});
