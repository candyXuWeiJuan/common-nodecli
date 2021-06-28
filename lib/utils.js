const fs = require('fs-extra');
const { resolve } = require('path');
const chalk = require('chalk');
const commdSuccess = (res) => {
	if (Array.isArray(res)) {
		return res.every((r) => r.status === 0 && r.error === null);
	}
	return res.status === 0 && res.error === null;
};
const log = console.log;
const logError = (mesg) => {
	log(chalk.red(`${mesg}`));
};
const selfPkgPath = resolve(__dirname, '../../package.json');
const selfPkgJson = {
	getJson() {
		try {
			return require(selfPkgPath);
		} catch (error) {
			return {};
		}
	},
	writeFile(path, keyValues) {
		return new Promise((resolve, reject) => {
			const json = selfPkgJson.getJson();
			Object.keys(keyValues).forEach((key) => {
				json[key] = keyValues[key];
			});
			fs.writeFile(path, JSON.stringify(json, null, '\t'), (err) => {
				if (err) {
					logError(err);
					reject(false);
				}
				resolve(true);
			});
		});
	},
};

exports.selfPkgJson = selfPkgJson;
exports.selfPkgPath = selfPkgPath;
exports.logError = logError;
exports.commdSuccess = commdSuccess;
