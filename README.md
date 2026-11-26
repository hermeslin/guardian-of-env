# guardian-of-env

[![CI](https://github.com/hermeslin/guardian-of-env/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/hermeslin/guardian-of-env/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/hermeslin/guardian-of-env/branch/master/graph/badge.svg)](https://codecov.io/gh/hermeslin/guardian-of-env)
[![version npm](https://img.shields.io/npm/v/guardian-of-env.svg?style=flat-square)](https://www.npmjs.com/package/guardian-of-env)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

`guardian-of-env` checks that your `.env` files have the same keys. Run it in CI, and the build fails when someone adds a variable to one file and forgets the others.

## Install

`guardian-of-env` needs Node.js 22.13 or later.

```sh
npm install --save-dev guardian-of-env
```

## Usage

```sh
npx guardian-of-env [--strict-order] <file> <file> [<file>...]
```

Give two or more files. `guardian-of-env` compares each file with the first one. It compares only the keys, so the values can differ. A path is relative to the current directory, or absolute.

| Option           | Effect                                                           |
| ---------------- | ---------------------------------------------------------------- |
| `--strict-order` | Also require the keys to be in the same order as the first file. |

`guardian-of-env` reads the files with [dotenv](https://github.com/motdotla/dotenv), the parser most Node.js apps use. A quoted value that spans several lines is one key.

## Exit codes

| Code | Meaning                                                                                         |
| ---- | ----------------------------------------------------------------------------------------------- |
| `0`  | Every file has the same keys.                                                                   |
| `1`  | A file lacks a key, a file repeats a key, or, with `--strict-order`, the keys are out of order. |
| `2`  | Nothing was compared: fewer than two files, an unknown option, or a file that cannot be read.   |

## Output

When every file matches, `guardian-of-env` prints `.env files all the same!`. Otherwise it prints every problem it found:

```console
$ npx guardian-of-env .env.example .env.ci .env.e2e
Not every file has the same keys:
╔══════════════╤═════════╤══════════╗
║ .env.example │ .env.ci │ .env.e2e ║
╟──────────────┼─────────┼──────────╢
║ API_KEY      │ API_KEY │          ║
╟──────────────┼─────────┼──────────╢
║              │ DEBUG   │          ║
╚══════════════╧═════════╧══════════╝
.env.ci has duplicate keys: PORT
```

The table has a row for each key that some file lacks. An empty cell means that file lacks the key.

File names are green on a color terminal. Piped output, such as a CI log, has no colors. Set `NO_COLOR` to turn colors off, or `FORCE_COLOR` to turn them on.

## Run it in CI

Add a script to `package.json`:

```json
{
  "scripts": {
    "check:env": "guardian-of-env .env.example .env.ci"
  }
}
```

Then run the script in your workflow, for example in GitHub Actions:

```yml
steps:
  - uses: actions/checkout@v7
  - uses: actions/setup-node@v7
    with:
      node-version: 22
  - run: npm ci
  - run: npm run check:env
```

## Upgrade from 1.x

Version 2 changes the defaults and the exit codes. See [the 2.0.0 changes](CHANGELOG.md#200).

## Development

Run lint, the format check, the type check and the tests (`npm run check`) inside Docker, isolated from the Node.js and npm installed on your machine (requires Docker with Compose v2):

```sh
# Node.js 22 (default)
docker compose run --rm --build test

# another Node.js version, e.g. 24
NODE_VERSION=24 docker compose run --rm --build test
```

Dependencies are installed inside the image from `package-lock.json`; your local `node_modules` is never used.

## Release

1. Set the version in `package.json` and the date of its `CHANGELOG.md` entry, and merge to `master`.
2. Push a tag named after the version, such as `v2.0.0`.

The `Publish` workflow runs `npm run check`, confirms that the tag matches `package.json`, and publishes to npm from the `npm-publish` environment through npm trusted publishing. No npm token is stored in the repository.
