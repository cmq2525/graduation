import index from './components/index.vue'
import checkCustomResponse from './components/checkCustomResponse.vue'
import checkTxRequest from './components/checkTxRequest.vue'
import checkTxResponse from './components/checkTxResponse.vue'
import customDataset from './components/customDataset.vue'
import getAllDataset from './components/getAllDataset.vue'
import getAllCustom from './components/getAllCustom.vue'
import sellDataset from './components/sellDataset.vue'
import login from './components/login.vue'
import test from './components/test.vue'

export default {
	routes:[
		{path:'/index',component:index},
		{path:'/checkCustomResponse',component:checkCustomResponse},
		{path:'/checkTxRequest',component:checkTxRequest},
		{path:'/checkTxResponse',component:checkTxResponse},
		{path:'/customDataset',component:customDataset},
		{path:'/getAllDataset',component:getAllDataset},
		{path:'/getAllCustom',component:getAllCustom},
		{path:'/sellDataset',component:sellDataset},
		{path:'/test',component:test},
		{path:'/login',component:login},
		{path:'*',redirect:'/index'}
	]
}
