const Koa = require('koa');
const childProcess = require('child_process');
const path = require('path');
const Log = require('../log');
const staticFiles = require('koa-static');
const MockRouter = require('./router');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const Fs = require('fs-extra');
var proxy = require('koa-http2-proxy');

class MockServer {
	constructor(name, port) {
		this.name = name;
		this.port = port || 8888;
		this.app = new Koa();
		this.proxy = new Koa();
		this.path = `${process.cwd()}\\.mock`;
		this.init();
		this.initRouter();
	}

	init() {
		this.app.use(staticFiles(path.join(__dirname, 'public')));
		this.app.use(bodyParser());
		this.proxy.use(cors());
	}

	async initRouter() {
		const self = this;
		const mockConfig = await Fs.readJson(`${this.path}\\index.json`);
		const options = {
			...mockConfig.proxy,
			onProxyRes(proxyRes, ctx) {
				if (ctx.req.url == '/favicon.ico') {
					return;
				}
				let body = [];
				proxyRes.on('data', function (chunk) {
					body.push(chunk);
				});
				proxyRes.on('end', function () {
					body = Buffer.concat(body).toString();
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
		if (options.target) {
			this.proxy.use(proxy(options));
		}
		this.proxy.use(async (ctx, next) => {
			if (ctx.req.url == '/favicon.ico') {
				return;
			}
			console.log(
				`[${new Date().toLocaleString()}]  from custom  ${ctx.req.method.toUpperCase()} ${
					ctx.req.url
				}`,
			);
			const api = self.getResCustomSet(ctx);
			ctx.response.body = api.data || {};
			await next();
		});
		this.mockRouter = new MockRouter(
			this.name,
			mockConfig,
			`${this.path}\\index.json`,
		);
		this.app.use(this.mockRouter.routes);
		this.app.use(this.mockRouter.allowedMethods);
	}
	getResCustomSet(ctx) {
		const { config } = this.mockRouter;
		const url = ctx.req.url.split('?')[0];
		const api = config.files.find(
			(file) =>
				file.url === url &&
				ctx.req.method.toLowerCase() === file.method.toLowerCase(),
		);
		return api || {};
	}
	async start() {
		this.app.listen(5656);
		this.proxy.listen(this.port);
		this.app.on('error', (err) => {
			Log.error('proxy server error', err);
		});
		this.proxy.on('error', (err) => {
			Log.error('config server error', err);
		});
		childProcess.exec('start http://127.0.0.1:5656');
		Log.success(
			`[${this.name}]mock服务启动在 ==> http://127.0.0.1:${this.port}`,
		);
	}
}

module.exports = MockServer;
