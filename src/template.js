const Path = require('./path');
const pathbasic = require('path');

const fse= require('fs-extra');
const fs = require('fs');
const Log = require('./log');

async function addTemplate(name,path){
    console.log(name,path)
	const userJson=await fse.readJSON(Path.templateUserConfigPath)
	const ifTplExit=userJson.list.find(val=>val.name==name)
	if(ifTplExit){Log.error("模板已存在");return}
	const ifTargetExit=await fse.pathExists(path)
	if(!ifTargetExit){Log.error("要拷贝文件不存在");return}
	const ifTplFileExit=await fse.pathExists(pathbasic.resolve(Path.templateListPath,path))
	if(ifTplFileExit){Log.error("文件已存在");return}
    //user.json更新
	console.log(pathbasic.basename(path))
	userJson.list.push({
		name: name,
		fileName: pathbasic.basename(path)
	})
	fse.writeJson(Path.templateUserConfigPath, userJson);
	//templateListPath目录下更新
	fs.stat(path, async (error, stat) => {
		if (error) {
			console.log(error);
		} else {
			const src = pathbasic.resolve(process.cwd(), path);
			const dest = pathbasic.resolve(Path.templateListPath, path);
			// stats.isFile()
			// stats.isDirectory()
			// stats.isBlockDevice()
			// stats.isCharacterDevice()
			// stats.isSymbolicLink() (only valid with fs.lstat())
			// stats.isFIFO()
			// stats.isSocket()
			if (stat.isFile()) {
				await fse.copy(src, dest);
			} else if (stat.isDirectory()) {
				await fse.copy(src, dest);
			}
		}
		Log.success(`添加成功：${path}`);
	});
    
}

async function removeTemplate(name) {
	const userConfig = await fse.readJSON(Path.templateUserConfigPath);
	let index = userConfig.list.findIndex(p => p.name === name);
	if (index > -1) {
		let one = userConfig.list[index];
		let fileName = pathbasic.resolve(Path.templateListPath, `./${one.fileName}`);
		await fse.remove(fileName);
		userConfig.list.splice(index, 1);
		fse.writeJson(Path.templateUserConfigPath, userConfig);
		Log.success('删除模板成功');

	} else {
		Log.error(`没有名为${name}的模板`);
	}
}

async function run(option,cmd) {
	if (option.List) {
		await listTemplate();
	} else if (option.Remove) {
		removeTemplate(option.Remove);
	} else if (option.Add) {
		const filePath = cmd.args[0];
		if (!filePath) {
			Log.error('-a|-add <name> <filePath> filePath参数不能为空');
			return;
		}
		await addTemplate(option.Add, filePath);
	} else {
		await listTemplate();
	}
}
async function listTemplate() {
	const config = await fse.readJSON(Path.templateConfigPath);
	const userConfig = await fse.readJSON(Path.templateUserConfigPath);
	console.table([...config.list, ...userConfig.list]);
}
exports.run = run;
