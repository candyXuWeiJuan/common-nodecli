const fse=require("fs-extra")
const inquirer=require("inquirer")
const path=require("path")
const HandleMock=require("./handleMock")
const Mock=require("./mock")
const mainPath=process.cwd()
function runServer(){
	const name=path.basename(mainPath)
	new HandleMock(name);
	new Mock(name);
}
exports.run=async function(){
	//当前目录创建.mock文件夹，没有该文件夹则创建
	const mockPathDir=`${mainPath}/.mock`
	const mockPathConfig=`${mockPathDir}/config.json`
	const mockDirExit=await fse.pathExists(mockPathDir)
	let configJson
	if(!mockDirExit){
		configJson= {
			proxy: {
				target: '',
			},
			v: 0,
			files: [],
		};
	}else {
        configJson=await fse.readJson(mockPathConfig)
	}
	inquirer.prompt([
		{
			type:"input",
			message: '请输入代理target, 如果不需要代理请直接回车',
			name: 'target',
		}
	]).then(async (answers)=>{
		const {target}=answers
		configJson.proxy.target=target
		await fse.ensureDir(mockPathDir)
		await fse.writeJSON(mockPathConfig,configJson)
		runServer();
	})
}

