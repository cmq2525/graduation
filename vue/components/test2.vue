<template>
	<div>
		<el-button @click="getAllDataset">获取待售数据集</el-button>
		<el-collapse>
			<el-collapse-item v-for="(dataset,index) in datasetList" 
			v-bind:key="index" >
				<template slot="title">
					<div>
						{{index}}{{dataset.dataName}}
					</div>
				</template>
				<el-card class="box-card word_wrap">
					<div>Name: {{dataset.dataName}}</div>
					<div>Data Hash: {{dataset.datasetHash}}</div>
					<div>Onsale: {{dataset.onSale}}</div>
					<div>Owner: {{dataset.owner}}</div>
					<div>Price: {{dataset.price}}</div>
					<div>Model Address:</div>
					<div>{{dataset.modelAddr}}</div>
					<div>
						<div>Dataset Information:</div>
						<el-card>
							{{dataset.dataInfo}}
						</el-card>
					</div>
					<div>
						<el-button @click="phurchaseDataset(dataset)">购买</el-button>
					</div>
				</el-card>
			</el-collapse-item>
		</el-collapse>
	</div>
	
	
	
</template>
<script>
import Platform from '../assets/js/Platform.js'
export default {
	data() {
		return {
			myContract:{},
			account : '0x86c923e0e2fad5862be4a552be46693ff84aa7cd',
			pwd : 'cmq19950520',
			datasetList:[]
			// dataset_onSale : [{name:'chen',info:['chen','meng','qi']},
			// {name:'meng',info:['wu','jian','shu']}]
		};
	},
	methods: {
		getAllDataset(){
			this.datasetList.reverse();
			Platform.getAllDataset(this.myContract,this.datasetList);
		},
		phurchaseDataset(dataset){
			var _this = this;
			this.$axios.get('/api/prepare_to_buy',{
				params:{
					dataset_hash:dataset.datasetHash
				}
			}).then(function(response){
				var pubKey = response.data;
				var listing = true;
				Platform.phurchaseRequest(_this.myContract,_this.account,_this.pwd,
				dataset.price,listing,dataset.datasetHash,dataset.owner,pubKey.toString());
			})
		}
	},
	created(){
		this.myContract = Platform.getContract();
	}
}
</script>

<style>
.box-card {
	width: 480px;
	text-align: left;
}
.word_wrap {
	word-break: break-all;
}
</style>