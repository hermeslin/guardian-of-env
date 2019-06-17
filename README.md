# guardian-of-env
[![Build Status](https://travis-ci.org/hermeslin/guardian-of-env.svg?branch=master)](https://travis-ci.org/hermeslin/guardian-of-env)
[![codecov](https://codecov.io/gh/hermeslin/guardian-of-env/branch/master/graph/badge.svg)](https://codecov.io/gh/hermeslin/guardian-of-env)
[![version npm](https://img.shields.io/npm/v/guardian-of-env.svg?style=flat-square)](https://www.npmjs.com/package/guardian-of-env) [![Greenkeeper badge](https://badges.greenkeeper.io/hermeslin/guardian-of-env.svg)](https://greenkeeper.io/)

## Installation
```sh
yarn add guardian-of-env --dev
```

## Configuration
in your project folder, execute `guardian-of-env`, and  `guardian-of-env` compares `.env` and `.env.example` file by default.

```sh
./node_modules/.bin/guardian-of-env
```

or compare files you want to
```
./node_modules/.bin/guardian-of-env .env .env.example .env.exmaple.example
```

## Strict mode
you want to ensure .env files all the same, and like the same sort of environment key names, use `--strict`

```sh
./node_modules/.bin/guardian-of-env --strict
```

```sh
./node_modules/.bin/guardian-of-env --strict .env .env.example .env.exmaple.example
```

## Work with pre-commit
install `pre-commit` first, and follow the configuration of package.json below
```js
{
    "scripts": {
        "guardian-of-env": "./node_modules/.bin/guardian-of-env --strict"
    },
    "pre-commit": [
        "guardian-of-env"
    ],
}
```

## Work with travis-ci
or you want to compare your .env files in the ci phase

### package.json
```js
{
    "scripts": {
        "guardian-of-env": "./node_modules/.bin/guardian-of-env --strict .env .env.test"
    },
}
```

### .travis.yml
```yml
script:
- yarn guardian-of-env
```
