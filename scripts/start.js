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
      { name: 'import-cn-jp', value: 'i-cn-jp' },
      { name: 'export-jp-cn', value: 'e-jp-cn' },
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
