<template>
	<div class="showSpace">
		<el-button @click="checkCustomResponse">查看定制响应</el-button>
		<el-collapse>
			<el-collapse-item v-for="(responseList,index) in customResponseList" v-bind:key="index">
				<template slot="title">
					<div>
						<span>Name: {{customList[index]}}</span>
						<el-badge :value="responseList.length" class="item"></el-badge>
					</div>
				</template>
				<el-collapse style="margin:10px">
					<el-collapse-item v-for="(response) in responseList" v-bind:key="response.owner">
						<template slot="title">
							<div>Owner: {{response.owner}}</div>
						</template>
						<div>
							<div>
								<div>Test result:</div>
								<el-card>
									{{response.responseAddr}}
								</el-card>
							</div>
							<el-button v-on:click="customPhurchase(response)" icon="el-icon-goods">购买</el-button>
						</div>
					</el-collapse-item>
				</el-collapse>
			</el-collapse-item>
		</el-collapse>
	</div>



</template>
<script>
	export default {
		data() {
			return {
				myContract: {},
				customList: this.$Global.customList,
				customResponseList: [],
			};
		},
		methods: {
			async checkCustomResponse() {
				let _this = this;
				let response = await this.$axios.get("/api/refreshData", {
					params: {
						paramsList: ['customList'],
					}
				});
				if (response.data.execResult == 'suc') {
					this.customList = response.data.customList;
				}
				window.console.log(this.customList)
				for (var i = 0; i < this.customList.length; i++) {
					response = await this.$axios.get('/api/checkCustomResponse', {
						params: {
							targetCustom: _this.customList[i],
						}
					});
					if (response.data.execResult == 'suc') {
						this.$set(this.customResponseList, i, response.data.responseList);
					}

				}
			},
			customPhurchase(response) {
				let _this = this;
				let formData = new FormData();
				window.console.log(response)
				formData.append('targetCustom', response.targetCustom);
				formData.append('owner', response.owner);

				this.$axios.post('/api/customPhurchase', formData).then(function(response) {
					if (response.data.execResult == 'suc') {
						_this.$message({
							type: 'success',
							message: "已发送购买请求！",
							showClose: true
						});
						window.console.log("customPhurchase suc");
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
		created() {}
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

	.showSpace {
		white-space: pre;
	}
</style>
