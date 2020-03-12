<template>
	<div>
		<el-button @click="getAllCustom">获取定制需求</el-button>
		<el-collapse>
			<el-collapse-item v-for="(custom,index) in customList" 
			v-bind:key="index" >
				<template slot="title">
					<div>
						{{index}}{{custom.dataName}}
					</div>
				</template>
				<el-card class="box-card word_wrap">
					<div>Name: {{custom.dataName}}</div>
					<div>Data Hash: {{custom.customHash}}</div>
					<div>Still Need: {{custom.stillNeed}}</div>
					<div>Buyer: {{custom.buyer}}</div>
					<div>Price: {{custom.price}}</div>
					<div>Model Address:</div>
					<div>{{custom.modelAddr}}</div>
					<div>
						<div>Dataset Information:</div>
						<el-card>
							{{custom.dataInfo}}
						</el-card>
					</div>
					<div>
						<input type="file" @change="getFile($event)">
						<el-button @click="customResponse(custom)" icon="el-icon-upload">发送定制响应</el-button>
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
			customList:[],
			dataFile:''
		};
	},
	methods: {
		getFile(event) {
			this.dataFile = event.target.files[0];
			console.log(this.dataFile);
		},
		getAllCustom(){
			var _this = this;
			this.$axios.get("/api/getAllCustom",{}).then(function(response){
				let execResult = response.data.execResult;
				if(execResult == 'suc'){
					_this.customList = response.data.customList;
					_this.$forceUpdate();
					window.console.log('getAllCustom suc')
				}
				else{
					window.console.log('Error!',response.data.msg);
				}
				
			})
		},
		customResponse(custom){
			var _this = this;
			let formData = new FormData();
			formData.append('customHash',custom.customHash);
			formData.append('modelAddr',custom.modelAddr);
			formData.append('file', this.dataFile);
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			this.$axios.post('/api/customizedResponse', formData, config).then(function(response) {
				if(response.data.execResult == 'suc'){
					_this.$message({
						type: 'success',
						message: "定制响应成功！",
						showClose: true,
					});
					window.console.log("customizedResponse suc");
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