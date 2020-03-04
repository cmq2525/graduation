<template>
	<div style="width:480px">
		<el-form >
			<el-form-item label="账户地址">
				<el-input v-model="account"></el-input>
			</el-form-item>
			<el-form-item label="账户密码">
				<el-input type="password" v-model="pwd" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data(){
		return {
			account : this.$Global.account,
			pwd : this.$Global.pwd
		}
	}
}
</script>

<style>
</style>
