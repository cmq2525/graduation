<template>
	<div style="width:480px">
		<el-form>
			<el-form-item label="账户">
				<el-input v-model="account"></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="pwd" show-password></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm">登录</el-button>
				<el-button @click="resetForm">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				account : this.$Global.account,
				pwd :this.$Global.pwd
			}
		},
		methods: {

			submitForm() {
				//event.preventDefault();
				let formData = new FormData();
				formData.append('account', this.account);
				formData.append('pwd', this.pwd);

				var _this = this;
				this.$axios.post('/api/login', formData).then(function(response) {
					let execResult = response.data.execResult;
					if(execResult == 'suc')
					{
						_this.$message({
							type: 'success',
							message: "登录成功！",
							showClose: true
						});
						window.console.log("login suc");
						_this.$Global.account = _this.account;
					}
					else{
						_this.$message({
							type: 'error',
							message: response.data.msg,
							showClose: true
						});
						window.console.log(response.data.msg);
					}
					
				});
			},
			resetForm() {
				this.account = '';
				this.pwd = '';
			}
		}
	}
</script>
