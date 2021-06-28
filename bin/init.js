const Path = require('../src/path');
const ora = require('ora');
const spinner = ora('cli:初始化...');
const Fs = require('fs-extra');

Path.init().then(async () => {
	const hasUserConfig = await Fs.pathExists(Path.templateUserConfigPath);
	if (!hasUserConfig) {
		const config = {
			name: 'tempalte',
			list: [],
		};
		Fs.writeJson(Path.templateUserConfigPath, config);
	}
	spinner.succeed('cli install succeed!');
});
