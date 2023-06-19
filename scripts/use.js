#!/usr/bin/env node

import inquirer from 'inquirer';
import { spawn } from 'child_process';

const prompts = [
  {
    name: 'packages',
    message: '选择要执行的项目:',
    type: 'list',
    pageSize: 11,
    choices: [
      { name: 'import-cn-jp', value: '@sk-houtai/i-cn-jp' },
      { name: 'admin', value: '@sk-houtai/admin' },
      { name: 'forwarder', value: '@sk-houtai/forwarder' },
      { name: 'importer', value: '@sk-houtai/importer' },
      { name: 'export-jp-cn', value: '@sk-houtai/e-jp-cn' },
    ],
  },
];

const [, , ...commend] = process.argv;

inquirer
  .prompt(prompts)
  .then((answers) => {
    spawn('yarn', ['workspace', answers.packages, ...commend], {
      stdio: 'inherit',
    });
  })
  .catch((error) => console.log(error));
