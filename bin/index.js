#!/usr/bin/env node

const pkg=require("../package.json")
const commander=require("commander");
const makefile=require("../src/makefile.js");
const create=require("../src/create")
const fetch=require("../src/fetch")
const template=require("../src/template")
const publish=require('../src/publish')
const install=require('../src/install')
const repository=require('../src/repository')
const mock=require("../src/mock/index")
commander
	.usage('<command> [options]')
	.version(pkg.version, '-v, --vers')
	.option('-t', 'test')
	.option('-mf -makefile <type>', '生成一些文件')
	.option('-c -create <name>', '根据模板新建文件')
	.option('-i -init <name> <type>', '根据模板新建文件')
	.description(pkg.description)
	.action(async (cmd) => {
		if (cmd.Create) {
			create.run(cmd.Create);
		} else if (cmd.Init) {
			fetch.run(cmd.Init);
		} else if (cmd.Makefile) {
			makefile.run(cmd.Makefile);
		}
	});
commander
	.command('init <name> [type]')
	.description('初始化项目')
	.action(async (name, type) => {
		fetch.run(name, type);
	});
commander
	.command('create <name> [type]')
	.description('创建模板')
	.action(async (name, type) => {
		create.run(name, type);
	});
commander
	.command('template')
	.alias('tpl')
	.option('-a -add <name> <filePath>', '新增模板')
	.option('-rm -remove <name>', '移除模板')
	.option('-ls -list', '列出所有模板')
	.description('模板管理')
	.action(async (name,cmd) => {
		template.run(name,cmd);
	});
commander
	.command('publish')
	.alias('pb')
	.description('发布到本地')
	.action(async () => {
		publish.run();
	});

commander
	.command('install [libName]')
	.alias('i')
	.description('安装本地发布的库')
	.action(async (libName) => {
		install.runInstall(libName);
	});

commander
	.command('uninstall [libName]')
	.alias('rm')
	.description('移除当前项目中安装的本地发布库')
	.action(async (libName) => {
		install.runUninstall(libName);
	});
commander
	.command('repository')
	.alias('rp')
	.option('-a -add <name> <url>', '新增模板仓库')
	.option('-rm -remove <name>', '移除模板仓库')
	.option('-ls -list', '列出所有模板仓库')
	.description('模板仓库管理')
	.action(async (cmd) => {
		repository.run(cmd);
	});
commander
    .command("mock")
	.description('mock数据')
	.action(async (cmd)=>{
		console.log(cmd)
		mock.run(cmd)
	})
commander.parse(process.argv)

