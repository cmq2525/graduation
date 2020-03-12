<template>
	<div>

		<el-button @click="checkPhurchaseResponse">查看购买响应</el-button>
		<el-collapse>
			<el-collapse-item v-for="(response,index) in txResponseList" v-bind:key="response.txHash">
				<template slot="title">
					<div>
						{{requestList[index]}}
					</div>
				</template>
				<div class='information'>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>数据集信息</span>
						</div>
						<div>Name: {{response.dataName}}</div>
						<div>Listing: {{response.listing}}</div>
						<div>Hash: {{response.dataHash}}</div>
						<div>Price: {{response.price}}</div>
						<div>IPFS Address: {{response.dataAddr}}</div>
						<div>Information: {{response.dataInfo}}</div>
					</el-card>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>



</template>
<script>
	export default {
		data() {
			return {
				requestList: this.$Global.requestList,
				txResponseList: [],
			};
		},
		methods: {
			async checkPhurchaseResponse() {
				let _this = this;
				let response = await this.$axios.get("/api/refreshData", {
					params: {
						'paramsList': ['requestList']
					}
				});
				if (response.data.execResult == 'suc') {
					this.requestList = response.data.requestList;
				}
				for (let i = 0; i < this.requestList.length; i++) {
					response = await this.$axios.get('/api/checkTxResponse', {
						params: {
							txHash: this.requestList[i]
						}
					});
					if (response.data.execResult == 'suc') {
						_this.$set(_this.txResponseList, i, response.data.txResponse);
					}
				}
			},
		},

		created() {}
	}
</script>

<style>
	.information {
		text-align: left;
		word-break: break-all;
	}

	.box-card {
		width: 480px;
	}
</style>
