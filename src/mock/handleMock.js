	const Koa=require("koa");
	const koaStatic=require("koa-static")
	const path=require("path")
	const fse=require("fs-extra")
	const MockRouter=require("./route")
	const childProcess=require("child_process")
	const bodyParser = require('koa-bodyparser');
	const mockConfigPath=`${process.cwd()}\\.mock\\config.json`
	const mockJson =async ()=> await fse.readJson(mockConfigPath);
	class HandleMock{
		constructor(){
			this.localApp=new Koa();
			this.initStatic()
			this.initRouter()
		}
		initStatic(){
			const staticFile=koaStatic(path.resolve(__dirname,"public"))
            this.localApp.use(staticFile)
			this.localApp.use(bodyParser());
		}
		async initRouter(){
			
			this.mockRouter = new MockRouter(
				this.name,
				await mockJson(),
				mockConfigPath,
			);
			this.localApp.use(this.mockRouter.routes);
			this.localApp.use(this.mockRouter.allowedMethods);
			this.localApp.listen(5656);
			this.localApp.on('error', (err) => {
				Log.error('proxy server error', err);
			});
			childProcess.exec('start http://127.0.0.1:5656');
		}
	}
	module.exports = HandleMock;
