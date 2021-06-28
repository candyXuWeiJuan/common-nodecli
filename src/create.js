const fse=require("fs-extra")
const fs=require("fs")
const path=require("path")
const inquirer=require("inquirer")
const log=require("./log")
const Path=require("./path")

function run(name,type){
	if (!type) {
		generateFileNoType(name);
		return;
	}
	generateFile(name, type);
}
async function generateFileNoType(name){
	const list =await getList()
	inquirer.prompt([{
		type: 'list',
		message: '请选择一个模板',
		name: 'type',
		choices: list
	}]).then((answers)=>{
        generateFile(name, answers.type)
	})
}
async function generateFile(name,type){
	const list = await getList()
    const ifExit=list.find((val)=>val.name==type)
	const extName=path.extname(ifExit.fileName)
	if(extName){
		const tempPath=Path.templateListPath
		makeFile(name,tempPath,ifExit.fileName)
	}else{
		const tempPath=path.resolve(Path.templateListPath,ifExit.fileName)
		const dirContent=await readdir(tempPath)
        createDir(name)
		dirContent.forEach(async (filename)=>{
            await makeFile(name,tempPath,filename,true)
		})
	}
}
async function makeFile(name,tempPath,choseFileName,fromDir){
    const filePath=path.resolve(tempPath,`${choseFileName}`)
	const extname = getExtname(choseFileName);
	const copyTemplate=await readFile(filePath)
	const compilerTemplate=compileTemplate(name, copyTemplate)
	const newFilePath=process.cwd()+(fromDir?("\\"+name):"")+"\\"+name+extname
	sourceWrite(newFilePath,compilerTemplate)
}

function readFile(filePath){
	return new Promise((resolve,reject)=>{
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	})
}
function readdir(filePath) {
	return new Promise((resolve, reject) => {
		fs.readdir(filePath, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
function writeFile(filePath, text) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, text, 'utf8', err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function compileTemplate(name,copyTemplate){
	return copyTemplate.replace(/\$\{name\}/g,name)
}
function sourceWrite(newFilePath,compilerTemplate){
	writeFile(newFilePath,compilerTemplate)
}
function getExtname(filename) {
	if (!filename) return '';
	let some = filename.split('.');
	some.shift();
	return '.' + some.join('.');
}
async function getList(){
	const config=await fse.readJson(Path.templateConfigPath)
	const userConfig= await fse.readJson(Path.templateUserConfigPath)
	return [...config.list,...userConfig.list]
}
async function createDir(name) {
	const tagertPath = process.cwd();
	await fse.ensureDir(`${tagertPath}/${name}`, {
		mode: 0o2775
	});
}
exports.run=run
