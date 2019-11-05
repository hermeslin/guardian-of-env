# guardian-of-env
[![Build Status](https://travis-ci.com/hermeslin/guardian-of-env.svg?branch=master)](https://travis-ci.com/hermeslin/guardian-of-env)
[![codecov](https://codecov.io/gh/hermeslin/guardian-of-env/branch/master/graph/badge.svg)](https://codecov.io/gh/hermeslin/guardian-of-env)
[![version npm](https://img.shields.io/npm/v/guardian-of-env.svg?style=flat-square)](https://www.npmjs.com/package/guardian-of-env)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

##  Screenshot
![Screenshot](https://raw.githubusercontent.com/hermeslin/guardian-of-env/master/result.png)

## Installation
```sh
yarn add guardian-of-env --dev
```

## Configuration
in your project folder, execute `guardian-of-env`, and  `guardian-of-env` compares `.env` and `.env.example` file by default.

```sh
npx guardian-of-env
```

or set more files that you want to compare
```
npx guardian-of-env .env .env.example .env.exmaple.example
```

## Work with pre-commit
install `pre-commit` first, and follow the configuration of package.json below
```js
{
    "scripts": {
        "guardian-of-env": "guardian-of-env"
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
        "guardian-of-env": "./node_modules/.bin/guardian-of-env .env .env.test"
    },
}
```

### .travis.yml
```yml
script:
- yarn guardian-of-env
```
