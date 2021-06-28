const path=require("path")
const fse=require("fs-extra")
const changeCase=require("change-case")
const Log=require("./log")
function componentExportIndex(){
	const processPath=process.cwd()
	const baseName=path.basename(processPath)
	const caseName=changeCase.pascalCase(baseName);
	const text = `import ${caseName} from './${baseName}'\r\nexport default ${caseName}`;
	fse.writeFile('./index.js', text);
	Log.success('创建成功');
}
const run=async function(){
    componentExportIndex()
}
module.exports={run}
