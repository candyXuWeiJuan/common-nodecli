const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const Path = require('./path');
const log = require('./log');
const ora = require('ora');
const inquirer = require('inquirer');
const spinner = ora('uninstall...');

async function runInstall(libName) {
	if (libName) {
		installByName(libName);
	} else {
		const list = await fs.readdir(Path.publishPath);
		const promptList = [
			{
				type: 'list',
				message: '选择需要安装的库:',
				choices: list,
				name: 'libName',
				filter: function (val) {
					return val.toLowerCase();
				},
			},
		];
		inquirer
			.prompt(promptList)
			.then((result) => {
				installByName(result.libName);
			})
			.catch();
	}
}
async function installByName(libName) {
	spinner.text = 'install...';
	spinner.start();
	const cmd = `npm i ${Path.publishPath}/${libName} --save-dev`;
	childProcess.exec(cmd, function (error, stdout, stderr) {
		if (error === null) {
			log.message(stdout);
			spinner.succeed('安装成功！');
		} else {
			log.error('exec error: ' + error);
			spinner.fail('安装失败！');
		}
	});
}

async function runUninstall(libName) {
	if (libName) uninstallByName(libName);
	else {
		const list = await fs.readdir(Path.publishPath);
		const promptList = [
			{
				type: 'list',
				message: '选择需要卸载的本地库:',
				choices: list,
				name: 'libName',
				filter: function (val) {
					return val.toLowerCase();
				},
			},
		];
		inquirer.prompt(promptList).then((result) => {
			uninstallByName(result.libName);
		});
	}
}
async function uninstallByName(libName) {
	spinner.text = 'uninstall...';
	spinner.start();
	const cmd = 'npm uninstall ' + '@pck-local/' + libName + ' --save-dev';
	console.log(cmd);
	childProcess.exec(cmd, function (error, stdout, stderr) {
		if (error === null) {
			log.message(stdout);
			spinner.succeed('移除安装成功！');
		} else {
			log.error('exec error: ' + error);
			spinner.fail('移除安装失败！');
		}
	});
}
exports.runInstall = runInstall;
exports.runUninstall = runUninstall;
