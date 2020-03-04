<template>
	<div>
		<el-collapse>
			<el-collapse-item v-for="dataset in dataset_onSale" 
			v-bind:key="dataset.name" >
				<template slot="title">
					<div>
						{{dataset.name}}
					</div>
				</template>
				<el-collapse style="margin:10px">
					<el-collapse-item v-for="item in dataset.info"
					v-bind:key="item">
					<template slot="title">
						<div>
							{{item}}
						</div>
					</template>
					<div>
						<span>1</span>
						<button v-on:click="phurchase_response">发送数据集</button>
					</div>
					</el-collapse-item>
				</el-collapse>
			</el-collapse-item>
		</el-collapse>
	</div>
	
	
	
</template>
<script>
//import my_data from '../assets/data/datasets.json'
export default {
	data() {
		return {
			activeNames: ['1'],
			dataset_onSale : [{name:'chen',info:['chen','meng','qi']},
			{name:'meng',info:['wu','jian','shu']}]
		};
	},
	methods: {
		handleChange(val) {
			console.log(val);
		},
		send_dataset(){
			
		},
		phurchase_response(){
			
		}
	},
	created(){
		//this.dataset_onSale = my_data.data;
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