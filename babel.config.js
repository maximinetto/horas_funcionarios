module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    ['@babel/preset-typescript', {allowDeclareFields: true}],
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ],
  ],
  ignore: ['**/*.test.ts', 'src/singleton.ts'],
};
