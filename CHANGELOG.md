# Changelog

This is the 1.x maintenance line. Version 2 is on the `master` branch.

## 1.3.0

- The runtime dependencies are newer: `diff` 5, `dotenv` 10 and `table` 6, up from `diff` 4, `dotenv` 8 and `table` 5. Node.js 10 or later is still supported.
- `lodash.isequal` is replaced by Node.js's `util.isDeepStrictEqual`, so installing no longer warns about a deprecated package.
- The package contains only `lib/`, `README.md` and `package.json`. 1.2.8 also shipped `.nycrc` and the 33 kB `result.png`.
- Releases are published to npm from GitHub Actions under the `latest-1` dist-tag, so `npm install guardian-of-env` keeps installing version 2. Install this line with `npm install guardian-of-env@1`.
