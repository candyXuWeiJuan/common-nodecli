const os = require('os');
const fse = require('fs-extra');
const path = require('path');
const homedir = os.homedir();
const userPath = path.resolve(homedir, '.cm-cli');
const configPath = path.resolve(__dirname, '../config');
async function init() {
	return new Promise((resolve, reject) => {
		fse.pathExists(userPath, async (err, exists) => {
			// 初始化用户目录
			if (!exists) await fse.ensureDir(userPath);
			// 拷贝系统默认配置和模板到 用户目录
			await fse.copy(configPath, userPath);
			resolve();
		});
	});
}
exports.init = init;
exports.userPath = userPath;
exports.templateConfigPath = path.resolve(userPath, './template/config.json');
exports.templateUserConfigPath = path.resolve(userPath, './template/user.json');
exports.templateListPath = path.resolve(userPath, './template/list');
exports.rpConfigPath = path.resolve(userPath, './repository/config.json');
//本地发布目录
exports.publishPath = path.resolve(userPath, './node_modules');
