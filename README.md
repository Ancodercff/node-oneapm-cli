# oneapm-cli

![NPM](https://img.shields.io/npm/v/oneapm-cli.svg?style=flat-square)
![NPM](https://img.shields.io/david/oneapm/oneapm-cli.svg?style=flat-square)

Command line for OneAPM NodeJS agent

[![NPM](https://nodei.co/npm/oneapm-cli.png)](https://nodei.co/npm/oneapl-cli/)


## Features

- Heap Snapshot
- CPU Profile
- Monitoring Dashboard

## Installation

```sh
npm install oneapm-cli -g
```

## Usage

```
Usage: /Users/wyvern/npm-global/bin/oneapm <command> [options] filename

Commands:
  start  Use oneapm to start an application

Options:
  -h, --help     Show this message                                     [boolean]
  -v, --version  Show version number                                   [boolean]
  -H, --host                                              [default: "127.0.0.1"]
  -p, --port                                                     [default: 8088]

Examples:
  start  oneapm start index.js

```
