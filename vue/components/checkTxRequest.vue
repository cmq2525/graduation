<template>
	<div>
		<el-button @click="checkPhurchaseRequest">查看购买请求</el-button>
		<el-collapse>
			<el-collapse-item v-for="(requestList,index) in txRequestList" v-bind:key="index">
				<template slot="title">
					<div>
						<span>Name: {{sellList[index]}}</span>
						<el-badge :value="requestList.length" class="item"></el-badge>
					</div>
				</template>
				<el-collapse style="margin:10px">
					<el-collapse-item v-for="(request,ind) in requestList" v-bind:key="ind">
						<template slot="title">
							<div>Buyer: {{request.buyer}}</div>
						</template>
						<div>
							<el-button v-on:click="phurchaseResponse(request)">发送数据集</el-button>
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
				myContract: {},
				account: '0x86c923e0e2fad5862be4a552be46693ff84aa7cd',
				pwd: 'cmq19950520',
				sellList: this.$Global.sellList,
				txRequestList: [],
			};
		},
		methods: {
			async checkPhurchaseRequest() {
				var response = await this.$axios.get("/api/refreshData", {
					params: {
						paramsList: ['sellList'],
					}
				});
				if(response.data.execResult == 'suc'){
					this.sellList = response.data.sellList;
				}
				for (var i = 0; i < this.sellList.length; i++) {
					response = await this.$axios.get('/api/checkTxRequest', {
						params: {
							targetData: this.sellList[i],
						}
					});
					if(response.data.execResult == 'suc'){
						this.$set(this.txRequestList, i, response.data.requestList);
					}
					
				}
				window.console.log('checkPhurchaseRequest suc');
			},
			phurchaseResponse(request) {
				var _this = this;
				let formData = new FormData();
				formData.append('targetData', request.targetData);
				formData.append('listing',request.listing);
				formData.append('buyer',request.buyer);
				formData.append('pubKey',request.pubKey);
				
				this.$axios.post('/api/phurchaseResponse', formData).then(function(response) {
					if (response.data.execResult == 'suc') {
						_this.$message({
							type: 'success',
							message: "发送数据集成功！",
							showClose: true
						});
						window.console.log("phurchaseResponse suc");
					} else {
						_this.$message({
							type: 'error',
							message: response.data.msg,
							showClose: true
						});
						window.console.log(response.data.msg);
					}
				});
			}
		},
		created() {
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
