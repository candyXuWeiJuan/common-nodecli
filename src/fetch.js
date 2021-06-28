const childProcess=require("child_process")
const fse = require('fs-extra');
const path = require('path');
const log = require('./log');
async function run(name,type){
	const config=path.resolve(__dirname,"config.json")
	let configJson =await fse.readJson(config)
	const repository=type?configJson.repository[type]:configJson.repository.default
	if(!repository) log.error("模板不存在")
	let gitCmd = `git clone ${repository} ./${name}`;
	let rmGit = `cd ./${name} && git remote rm origin`;
	childProcess.exec(gitCmd, function (error, stdout, stderr) {
		if (error !== null) {
			log.error('exec error: ' + error);
		}
		if (stdout) {
			log.error(stdout);
		}
		if (stderr) {
			log.error(stderr);
		}
		const packageFile = `./${name}/package.json`;
		fse.readJson(packageFile)
			.then((data) => {
				data.name = name;
				log.success(`template version ${data.version}`);
				fse.writeJson(packageFile, data).then(() => {
					log.success(`${name} init success!`);
					childProcess.exec(rmGit);
				});
			})
			.catch((err) => {
				log.error(err);
			});
	});
}
exports.run=run
