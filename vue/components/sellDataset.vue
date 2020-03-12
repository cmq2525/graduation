<template>
	<div style="width:480px">
		<el-form>
			<el-form-item label="上传数据集">
				<input type="file" @change="getFile($event)">
			</el-form-item>
			<el-form-item label="数据集名称">
				<el-input v-model="dataName"></el-input>
			</el-form-item>
			<el-form-item label="出售价格">
				<el-input v-model="price"></el-input>
			</el-form-item>
			<el-form-item label="数据集描述信息">
				<el-input type="textarea" v-model="dataInfo"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm">出售</el-button>
				<el-button @click="resetForm">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				dataName: '',
				price: '',
				dataInfo: '',
				dataFile: ''
			}
		},
		methods: {
			// post文件上传
			getFile(event) {
				this.dataFile = event.target.files[0];
				console.log(this.dataFile);
			},
			submitForm() {
				//event.preventDefault();
				let formData = new FormData();
				formData.append('dataName', this.dataName);
				formData.append('price', this.price);
				formData.append('dataInfo', this.dataInfo);
				formData.append('file', this.dataFile)
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
				var _this = this;
				this.$axios.post('/api/sellDataset', formData, config).then(function(response) {
					let execResult = response.data.execResult;
					if(execResult == 'suc')
					{
						_this.$message({
							type: 'success',
							message: "出售数据集成功！",
							showClose:true
						});
						window.console.log("sellDataset suc");
					}
					else{
						_this.$message({
							type:'error',
							message:response.data.msg,
							showClose:true
						});
						window.console.log('Error!',response.data.msg);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			resetForm() {
				this.dataName = '';
				this.price = '';
				this.dataInfo = '';
				this.dataFile = '';
			}
		}
	}
</script>
