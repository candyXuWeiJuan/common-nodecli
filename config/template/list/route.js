import Vue from 'vue';

export default {
	path: '/${name}',
	component: Vue.component('${name}', {render: h => h('router-view')}),
	meta: {
		name: '${name}',
		auth: ['user']
	},
	children: []
};