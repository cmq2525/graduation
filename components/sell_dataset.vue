<template>
	<div style="width:480px">
		<el-form >
			<el-form-item label="数据集名称">
				<el-input v-model="dataName"></el-input>
			</el-form-item>
			<el-form-item label="数据集路径">
				<el-input v-model="dataPath"></el-input>
			</el-form-item>
			<el-form-item label="出售价格">
				<el-input v-model="dataPrice"></el-input>
			</el-form-item>
			<el-form-item label="数据集描述信息">
				<el-input type="textarea" v-model="dataInfo"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submit_form">出售</el-button>
				<el-button @click="reset_form">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import Platform from '../assets/js/Platform.js'
export default {
	data(){
		return {
			dataName:"",
			dataPath:"",
			dataPrice:"",
			dataInfo:"",
			sellList : this.$Global.sellList,
			sellDict : this.$Global.sellDict,
			myContract:{},
			account : '0x86c923e0e2fad5862be4a552be46693ff84aa7cd',
			pwd : 'cmq19950520'}
	},
	methods:{
		reset_form(){
			this.dataName = "";
			this.dataPath = "";
			this.dataPrice = "";
			this.dataInfo = "";
		},
		submit_form(){
			var _this = this;
			this.$axios.get('/api/train_and_upload',{
				params:{
					data:this.dataPath
				}
			}).then(function(response){
				var modelAddr = response.data;
				Platform.sellData(_this.myContract,_this.account,_this.pwd,
				Number(_this.dataPrice),modelAddr,_this.dataName,
				_this.dataInfo).then(function(datasetHash){
					_this.$axios.get('/api/update_hash',{
						params:{
							model_addr:modelAddr,
							dataset_hash:datasetHash
						}
					}).then(function(response){
						if(response.data=='success'){
							_this.sellList.push(datasetHash);
							_this.sellDict[datasetHash] = {
								dataName:_this.dataName,
								dataPrice:_this.dataPrice,
								dataInfo:_this.dataInfo
							}
						}
					});
				});
				
			});
		}
	},
	created(){
		this.myContract = Platform.getContract();
		this.$axios.get('/api/register',{
			params:{
				account:'0x86c923e0e2fad5862be4a552be46693ff84aa7cd',
				password:'cmq19950520'
			}
		}).then(function(data){
			console.log(data);
			});
	}
}
</script>

<style>
</style>
