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
					<div>Data Hash: {{dataset.dataHash}}</div>
					<div>On Sale: {{dataset.onSale}}</div>
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
						<el-button @click="phurchaseDataset(dataset)" icon="el-icon-goods">购买数据集</el-button>
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
			datasetList:[],
		};
	},
	methods: {
		getAllDataset(){
			var _this = this;
			this.$axios.get("/api/getAllDataset",{}).then(function(response){
				let execResult = response.data.execResult;
				if(execResult == 'suc'){
					_this.datasetList = response.data.datasetList;
					_this.$forceUpdate();
					window.console.log('getAllDataset suc')
				}
				else{
					window.console.log('Error!',response.data.msg);
				}
				
			})
		},
		phurchaseDataset(dataset){
			var _this = this;
			let formData = new FormData();
			formData.append('price',dataset.price);
			formData.append('targetData',dataset.dataHash);
			formData.append('owner',dataset.owner);
			this.$axios.post('/api/listingPhurchase', formData).then(function(response) {
				if(response.data.execResult == 'suc'){
					_this.$message({
						type: 'success',
						message: "已发送购买请求！",
						showClose: true,
					});
					window.console.log("phurchaseDataset suc");
				}
				else{
					_this.$message({
						type: 'error',
						message: response.data.msg,
						showClose: true,
					});
					window.console.log(response.data.msg);
				}
			});
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