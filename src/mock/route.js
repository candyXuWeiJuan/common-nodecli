const Router = require('koa-router');
const Fs = require('fs-extra');

class MockRouter {
	constructor(name, config, path) {
		console.log(name,config,path)
		this.name = name;
		this.config = config;
		this.path = path;
		this.router = Router();
		this.timer = '';
		this.init();
	}
	// 注册基础服务路由
	init() {
		this.router.post('/api/v1/mock-server/list', async (ctx) => {
			ctx.response.body = {
				code: 200,
				result: this.config,
				message: 'success',
			};
		});
		this.router.post('/api/v1/mock-server/add', async (ctx) => {
			const data = ctx.request.body;
			const methodAndUrlRepeat = this.findOneByUrlAndMethod(
				data.url,
				data.method,
			);
			if (methodAndUrlRepeat) {
				ctx.response.body = {
					code: 500,
					message: '接口url和请求方法不能和已存在的接口同时重复',
				};
				return;
			}
			this.config.files.push(data);
			this.saveConfig();
			ctx.response.body = {
				code: 200,
				message: 'success',
			};
		});
		this.router.post('/api/v1/mock-server/update', async (ctx) => {
			const data = ctx.request.body;
			const one = this.findOneByUrlAndMethod(data.url, data.method);
			one.url = data.url;
			one.name = data.name;
			one.method = data.method;
			one.data = data.data;
			this.saveConfig();
			ctx.response.body = {
				code: 200,
				message: 'success',
			};
		});
		this.router.post('/api/v1/mock-server/delete', async (ctx) => {
			const data = ctx.request.body;
			const files = this.config.files || [];
			const index = files.findIndex((f) => f.name === data.name);
			if (index > -1) {
				files.splice(index, 1);
				this.saveConfig();
				ctx.response.body = {
					code: 200,
					data: files,
					index: index,
					message: 'success',
				};
			} else {
				ctx.response.body = {
					code: 500,
					message: '删除失败，没有对应的接口',
				};
			}
		});
	}

	mockRouteCallback(ctx) {
		const one = this.findOneByUrl(ctx.request.url);
		ctx.response.body = one.data;
	}

	saveConfig() {
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			Fs.writeJSON(this.path, this.config);
		}, 200);
	}

	findOneByName(name) {
		const files = this.config.files || [];
		return files.find((f) => f.name === name);
	}

	findOneByUrl(url) {
		const files = this.config.files || [];
		return files.find((f) => f.url === url);
	}
	findOneByUrlAndMethod(url, method) {
		const files = this.config.files || [];
		return files.find(
			(f) =>
				f.url === url &&
				f.method.toLowerCase() === method.toLowerCase(),
		);
	}
	get routes() {
		return this.router.routes();
	}

	get allowedMethods() {
		return this.router.allowedMethods();
	}
}

module.exports = MockRouter;
