const Fs = require('fs-extra');
const path = require('path');
const Path = require('./path');
const Log = require('./log');

async function run(cmd) {
	if (cmd.List) {
		rplist();
	} else if (cmd.Remove) {
		rpRemove(cmd.Remove);
	} else if (cmd.Add) {
		const rpUrl = cmd.args[0];
		if (!rpUrl) {
			Log.error('-a|-add <name> <url> url参数不能为空');
			return;
		}
		await rpAdd(cmd.Add, rpUrl);
	} else {
		await rplist();
	}
}

async function rpRemove(name) {
	console.log(Path.rpConfigPath);
	const config = await Fs.readJSON(Path.rpConfigPath);
	const index = config.repository.findIndex((p) => p.name === name);
	if (index > -1) {
		config.repository.splice(index, 1);
		Fs.writeJson(Path.rpConfigPath, config);
		Log.success('删除仓库成功');
	} else {
		Log.error(`没有名为${name}的仓库`);
	}
}

async function rplist() {
	const config = await Fs.readJSON(Path.rpConfigPath);
	console.table(config.repository);
}

async function rpAdd(name, url) {
	const config = await Fs.readJSON(Path.rpConfigPath);
	const one = config.repository.find((p) => p.name === name);
	if (one) {
		Log.error('已存在同名仓库');
		return;
	}
	config.repository.push({
		name: name,
		url: url,
		type: 'user',
	});
	Fs.writeJson(Path.rpConfigPath, config);
}
exports.run = run;
