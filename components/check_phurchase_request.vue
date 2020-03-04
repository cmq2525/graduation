<template>
	<div>
		<el-button @click="checkPhurchaseRequest">查看购买请求</el-button>
		<el-collapse>
			<el-collapse-item v-for="(datasetRequest,index) in txRequestList" 
			v-bind:key="index" >
				<template slot="title">
					<div>
						<span>Name: {{sellDict[sellList[index]].dataName}}</span>
						<!-- <el-divider direction="vertical"></el-divider>
						<span>Hash: {{sellList[index]}}</span> -->
					</div>
				</template>
				<el-collapse style="margin:10px">
					<el-collapse-item v-for="(request,ind) in datasetRequest"
					v-bind:key="ind">
					<template slot="title">
						<div>Buyer: {{request.buyer}}</div>
					</template>
					<div>
						<el-button v-on:click="phurchase_response(sellList[index],request.buyer,request.listing,request.pubKey)">发送数据集</el-button>
					</div>
					</el-collapse-item>
				</el-collapse>
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
			sellList :this.$Global.sellList,
			sellDict : this.$Global.sellDict,
			txRequestList:[],
			thisBlock:0
		};
	},
	methods: {
		async checkPhurchaseRequest(){
			var _this = this;
			for(var i =0; i<this.sellList.length;i++){
				await Platform.checkTxRequest(this.myContract,this.sellList[i],
				this.thisBlock).then(function(requestList){
					_this.txRequestList.push(requestList);
				});
			}
		},
		phurchase_response(dataHash,buyer,listing,pubKey){
			var _this = this;
			this.$axios.get('/api/send_dataset',{
				params:{
					pub_key:pubKey,
					dataset_hash:dataHash
				}
			}).then(function(response){
				var dataAddr = response.data;
				window.console.log(dataAddr);
				Platform.phurchaseResponse(_this.myContract,_this.account,_this.pwd,
				listing,dataHash,buyer,dataAddr);
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