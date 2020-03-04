import index from './components/index.vue'
import checkPhurchaseRequest from './components/check_phurchase_request.vue'
import checkPhurchaseResponse from './components/check_phurchase_response.vue'
import getAllDataset from './components/get_all_datasets.vue'
import sellDataset from './components/sell_dataset.vue'
import login from './components/login.vue'
import test from './components/test.vue'

export default {
	routes:[
		{path:'/index',component:index},
		{path:'/checkPhurchaseRequest',component:checkPhurchaseRequest},
		{path:'/checkPhurchaseResponse',component:checkPhurchaseResponse},
		{path:'/getAllDataset',component:getAllDataset},
		{path:'/sellDataset',component:sellDataset},
		{path:'/test',component:test},
		{path:'/login',component:login},
		{path:'*',redirect:'/index'}
	]
}
