export default {
	path: '/${name}',
	component: () => import('./${name}.vue'),
	meta: {
		name: '${name}',
		auth: ['user']
	},
	children: []
};