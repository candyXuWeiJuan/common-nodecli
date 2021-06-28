const fs = require('fs-extra');
const Path = require('./path');
const path = require('path');
const log = require('./log');
const ora = require('ora');
const {
	fetchAsyncQuestionPropertyQuestionProperty,
} = require('inquirer/lib/utils/utils');
const spinner = ora('publish to local...');
async function run() {
	spinner.start();
	const tagertPath = process.cwd();
	const packageJson = await fs.readJSON(`${tagertPath}/package.json`);
	const packageName = packageJson.name;
	console.log(/==>/, packageName);
	const files = packageJson.files;
	if (!files) {
		spinner.fail('没有配置发布白名单');
		return;
	}
	const localModel = await fs.pathExists(Path.publishPath);
	if (!localModel)
		await fs.ensureDir(Path.publishPath, {
			mode: '0666',
		});
	const writePath = `${Path.publishPath}/${packageName}`;
	const ifWritePath = await fs.pathExists(writePath);
	if (ifWritePath) {
		await fs.emptyDir(writePath);
		log.error('移除上一个本地版本');
	}
	await fs.ensureDir(writePath, {
		mode: '0666',
	});
	//修改package.json的name
	packageJson.name = '@pck-local/' + packageName;
	await fs.writeJSON(writePath + '/package.json', packageJson);
	files.forEach(async (element) => {
		const targetFilePath = `${writePath}/${element}`;
		await fs.ensureDir(targetFilePath, {
			mode: '0666',
		});
		await fs.copy(tagertPath + '/' + element, targetFilePath);
	});
	setTimeout(() => {
		log.message('本地发布目录:' + writePath);
		spinner.succeed('publish to local succeed!');
	}, 3000);
}
exports.run = run;
