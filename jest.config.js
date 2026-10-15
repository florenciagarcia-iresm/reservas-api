module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/seed.ts',
    '!src/data-source.ts',
  ],
};