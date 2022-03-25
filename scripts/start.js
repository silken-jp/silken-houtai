#!/usr/bin/env node

const inquirer = require('inquirer');
const spawn = require('child_process').spawn;

const prompts = [
  {
    name: 'packages',
    message: '选择要执行的项目:',
    type: 'list',
    pageSize: 11,
    choices: [
      { name: 'forwarder', value: '@sk-houtai/forwarder' },
      { name: 'import-cn-jp', value: '@sk-houtai/i-cn-jp' },
      { name: 'export-jp-cn', value: '@sk-houtai/e-jp-cn' },
      { name: 'importer', value: '@sk-houtai/importer' },
    ],
  },
];

inquirer
  .prompt(prompts)
  .then((answers) => {
    spawn('yarn', ['workspace', answers.packages, process.argv[2]], {
      stdio: 'inherit',
    });
  })
  .catch((error) => console.log(error));
