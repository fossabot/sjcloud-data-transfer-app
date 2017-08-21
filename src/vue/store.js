import Vue from 'vue';
import Vuex from 'vuex';
import fakeProgress from '../../tests/fakeProgress';

Vue.use(Vuex);

const environment = 'dev';

var tools = environment == 'dev' ? [{
			name: 'Rapid RNA-Seq',
			size: 168,
			upload: [
				{name: 'file_u1', size: 12, status: 0, checked: false},
				{name: 'file_u2', size: 10, status: 0, checked: false},
				{name: 'file_u3', size: 8, status: 0, checked: false},
				{name: 'file_u4', size: 16, status: 0, checked: false},
				{name: 'file_u5', size: 20, status: 0, checked: false},
				{name: 'file_u6', size: 5, status: 0, checked: false},
				{name: 'file_u7', size: 11, status: 0, checked: false}
			],
			download: [
				{name: 'file_d1', size: 12, status: 0, checked: false},
				{name: 'file_d2', size: 10, status: 0, checked: false},
				{name: 'file_d3', size: 8, status: 0, checked: false}
			]
		},{
			name: 'WARDEN',
			size: 501,
			upload: [],
			download: [
				{name: 'file_dw1', size: 12, status: 0, checked: false},
				{name: 'file_dw2', size: 10, status: 0, checked: false},
				{name: 'file_dw3', size: 8, status: 0, checked: false},
			]
		},{
			name: 'ChIP-Seq',
			size: 192,
			upload: [
				{name: 'file_uc1', size: 9, status: 0, checked: false},
				{name: 'file_uc2', size: 101, status: 0, checked: false}
			],
			download: [
				{name: 'file_c0', size: 12, status: 0, checked: false},
				{name: 'file_c1', size: 12, status: 0, checked: false},
				{name: 'file_c2', size: 10, status: 0, checked: false},
				{name: 'file_c3', size: 8, status: 0, checked: false},
				{name: 'file_c4', size: 16, status: 0, checked: false},
				{name: 'file_c5', size: 20, status: 0, checked: false},
				{name: 'file_s1', size: 12, status: 0, checked: false},
				{name: 'file_s2', size: 10, status: 0, checked: false},
				{name: 'file_s3', size: 8, status: 0, checked: false},
				{name: 'file_s4', size: 16, status: 0, checked: false},
				{name: 'file_s5', size: 20, status: 0, checked: false},
				{name: 'file_s1', size: 12, status: 0, checked: false},
				{name: 'file_s2', size: 10, status: 0, checked: false},
				{name: 'file_s3', size: 8, status: 0, checked: false},
				{name: 'file_s4', size: 16, status: 0, checked: false},
				{name: 'file_s5', size: 20, status: 0, checked: false}
			]
		}] : [];


if (environment !== 'dev') {
	console.log(this);
	window.dx.getToolsInformation(function(err, results) {
		console.log(that);
		that.setTools(results);
	});
}

var currToolName = '';

if (tools !== undefined && tools.length > 0) {
	currToolName = tools[0].name;
}

export default new Vuex.Store({
	state: {
		environment,
		tools, 
		currToolName,

		/** Install **/
		installingDxToolkit: "waiting",
		downloadStatus: "Downloading...",

		/** Login **/
		loginState: "waiting-2",
		token: "",

		/** Upload/Download **/
		currPath: 'upload',
	},
	getters: {
		/** Global **/
		environment(state, getters) {
			return state.environment;
		},

		/** Install **/
		installingDxToolkit(state, getters) {
			return state.installingDxToolkit;
		}, 
		downloadStatus(state, getters) {
			return state.downloadStatus;
		},

		/** Login **/
		loginState(state, getters) {
			return state.loginState;
		}, 
		token(state, getters) {
			return state.token;
		}, 

		/** Upload/Download **/
		currTool(state) {
			return state.tools.filter(t=>t.name==state.currToolName)[0]
		},	
		currPath(state) {
			return state.currPath
		},
		tool(state) {
			return name=>state.tools.filter(t=>t.name==name)[0]
		},
		tools(state) {
			const lst=[]
			state.tools.forEach((t,i)=>{
				lst.push({
					name: t.name,
					size: t.size
				})
			})
			return lst
		},
		currFiles(state,getters) {
			const tool=getters.currTool;
			return !tool || !Array.isArray(tool[state.currPath]) ? [] 
				: tool[state.currPath] 
		},
		checkedFiles(state,getters) {
			const tool=getters.currTool;
			return !tool || !Array.isArray(tool[state.currPath]) ? [] 
				: tool[state.currPath].filter(f=>f.checked)
		}
	},
	mutations: {
		/** Install **/
		setInstallingDxToolkit(state, installing) {
			state.installingDxToolkit = installing;	
		},
		setDownloadStatus(state, status) {
			state.downloadStatus = status;
		},

		/** Login **/
		setLoginState(state, status) {
			state.loginState = status;
		},
		setToken(state, token) {
			state.token = token;
		},

		/** Upload/Download **/
		setTools(state, tools) {
			state.tools = tools;
		},
		setCurrToolName(state,toolName) {
			state.currToolName = toolName;
		},
		setCurrPath(state,path) {
			state.currPath=path
		},
		addFiles(state,d) {
			const tool= state.tools.filter(t=>t.name==state.currToolName)[0];
			if (!tool || !tool[state.currPath]) {
				console.log("Invalid tool name='"+stat.currToolName+"' and/or path='"+state.currPath+"'.")
				return;
			}
			const currFiles=tool[state.currPath];
			d.files.forEach(f=>{
				currFiles.push({
					name:f.name,
					size:f.size*0.000000001,
					status:0,
					checked:false
				})
			})
			fakeProgress(state)
		},
		downloadFiles(state) { console.log('store downloadFiles',state.tools)
			fakeProgress(state)
		},
		trackProgress(state) { console.log('trackProgress')
			fakeProgress(state)
		}
	},
	actions: {
		/*downloadFiles(state) { console.log('store downloadFiles',state)
			fakeProgress(state)
		}*/
	}
});
