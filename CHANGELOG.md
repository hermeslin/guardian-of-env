# Changelog

## 2.0.0

### Breaking changes

- Node.js 22.13 or later is required. 1.x supported Node.js 10 and later.
- You must give at least two files. With fewer, `guardian-of-env` exits with code 2. 1.x compared `.env` with `.env.example` when you gave no files.
- Key order no longer matters. Pass `--strict-order` to get the 1.x check back.
- A key that appears twice in one file is an error. 1.x kept the last value without a warning.
- Exit code 1 now means only that the files differ. A missing file, a directory, or a bad argument exits with code 2 and a one-line message. In 1.x, these errors printed a stack trace and exited with code 1.
- The table has a column for each file and a row only for each key that some file lacks. 1.x drew a row for every key, and stopped at the first file that differed.
- A quoted value that spans several lines is one key. 1.x used dotenv 10, which read each line of the value as a possible key.
- Output has colors only on a color terminal. 1.x always printed color codes.
- The package is a CLI only. It no longer has a `main` entry, so `require('guardian-of-env')` and `import 'guardian-of-env'` fail.

### Fixes

- File names with digits or capital letters, such as `.env.e2e` and `.env.Production`, no longer crash.
- Absolute paths work.
- Three or more files no longer crash when a file after the second one differs.

### Internal

- The source is TypeScript compiled to ES modules. The package has `dotenv` and `table` as its only dependencies.
- npm replaces yarn, Vitest replaces mocha, and ESLint with typescript-eslint and Prettier replace the airbnb config.
