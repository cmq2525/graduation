<template>
	<div>
		
		<el-button @click="checkPhurchaseResponse">查看购买响应</el-button>
		<el-collapse>
			<el-collapse-item v-for="(response,index) in txResponseList" 
			v-bind:key="response.txHash" >
				<template slot="title">
					<div>
						{{requestList[index]}}
					</div>
				</template>
				<div class='information'>
					<div>Name: {{requestDict[requestList[index]].dataName}}</div>
					<div>Hash: {{requestDict[requestList[index]].dataHash}}</div>
					<div>Price: {{requestDict[requestList[index]].price}}</div>
					<div>IPFS Address: {{txResponseList[index].dataAddr}}</div>
					<div>Information: {{requestDict[requestList[index]].dataInfo}}</div>
				</div>
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
			requestList :this.$Global.requestList,
			requestDict : this.$Global.requestDict,
			txResponseList:[],
			thisBlock:0,
		};
	},
	methods: {
		async checkPhurchaseResponse(){
			var _this = this;
			for(var i =0; i<this.requestList.length;i++){
				var responseList = await Platform.checkTxResponse(this.myContract,this.requestList[i],
				this.thisBlock);
				if (responseList.length == 0){
						window.console.log("没有响应");
						_this.txResponseList[i] = {} ;
					}
				var responseObj = responseList[0];
				var response = await _this.$axios.get('/api/test',{
					params:{
						tx_hash:_this.requestList[i],
						cipher:_this.responseObj.dataAddr
					}
				});
				responseObj['dataAddr'] = response.data;
				//_this.txResponseList[i] = responseObj;
				_this.$set(_this.txResponseList,i,responseObj);
			}
			//this.$forceUpdate();
		},
		f1(){
			this.$forceUpdate();
		}
	},
	
	created(){
		this.myContract = Platform.getContract();
	}
}
</script>

<style>
.information {
	text-align: left;
	word-break: break-all;
}
</style>