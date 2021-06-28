const Koa=require("koa");
const Log=require("../log.js")
const cors = require('koa2-cors');
const fse = require('fs-extra');
const proxy=require("koa-http2-proxy")
const mockConfigPath=`${process.cwd()}\\.mock\\config.json`
const configJson = async ()=>await fse.readJson(mockConfigPath);
class Mock{
	constructor(name,port){
		this.init(port)
		this.initRouter();
		this.start()
	}
	init(port){
        this.dataApp=new Koa();
		this.port=port||5555;
		this.dataApp.use(cors())
	}
	async initRouter(){
        const self = this;
		const config=await configJson()
		const options = {
			...config.proxy,
			onProxyRes(proxyRes, ctx) {
				if (ctx.req.url == '/favicon.ico') {
					return;
				}
				let body = [];
				proxyRes.on('data', function (chunk) {
					console.log("chunk",chunk)
					body.push(chunk);
				});
				proxyRes.on('end', function () {
					console.log("end")
					console.log("endbodaybefore",body)
					body = Buffer.concat(body).toString();
					console.log("endbodaylater",body)
					if (
						body &&
						body !== '接口没有返回，请检查接口文件位置是否正确'
					) {
						console.log(
							`[${new Date().toLocaleString()}]  from proxy  ${ctx.req.method.toUpperCase()} ${
								ctx.req.url
							}`,
						);
						ctx.response.body = body;
					} else {
						console.log(
							`[${new Date().toLocaleString()}]  from custom  ${ctx.req.method.toUpperCase()} ${
								ctx.req.url
							}`,
						);
						const api = self.getResCustomSet(ctx);
						ctx.response.body = api.data || body;
					}
				});
			},
		};
		console.log("options",options)
		if (options.target) {
			this.dataApp.use(proxy(options));
		}
		this.dataApp.use(async (ctx, next) => {
			console.log("llallalallaall")
			if (ctx.req.url == '/favicon.ico') {
				return;
			}
			console.log(
				`[${new Date().toLocaleString()}]  from custom  ${ctx.req.method.toUpperCase()} ${
					ctx.req.url
				}`,
			);
			const api = await self.getResCustomSet(ctx);
			ctx.response.body = api.data || {};
			await next();
		});
	}
	async getResCustomSet(ctx) {
	    const config=await configJson()
		const url = ctx.req.url.split('?')[0];
		const api = config.files.find(
			(file) =>
				file.url === url &&
				ctx.req.method.toLowerCase() === file.method.toLowerCase(),
		);
		console.log("api",api)
		return api || {};
	}
	start(){
		this.dataApp.listen(5555);
		this.dataApp.on('error', (err) => {
			Log.error('proxy server error', err);
		});
		Log.success(`mock服务启动在 ==> http://127.0.0.1:${this.port}`)
		
	}
}
module.exports=Mock
