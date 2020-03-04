<template>
	<div>
		<p>this is a simple Calculator！</p>
		
		<div>
			<el-input v-model="x" v-bind:placeholder="x" size="small"></el-input>
		</div>
		<div>
			<el-button v-on:click="setAdd">+</el-button>
			<el-button v-on:click="setSub">-</el-button>
			<el-button v-on:click="setMul">*</el-button>
			<el-button v-on:click="setDiv">/</el-button>
		</div>
		<div>
			<el-input v-model="y" v-bind:placeholder="y"></el-input>
		</div>
		<div>
			<el-button v-on:click="calculate">Calculate</el-button>
		</div>
		<div>
			<el-input v-model="x" placeholder=0></el-input>
		</div>
						
	</div>
</template>

<script>
import Calculator from "../assets/js/Calculator.js";
export default {
	name:'test2',
	data:function(){
		return {
			value:44,
			x:0,
			y:0,
			contract:{},
			execFunction:function(){}
			};
	},
	methods:{
		f1:function(){
			var _this = this;
			var web3 = new this.$Web3(new this.$Web3.providers.HttpProvider('http://localhost:8545'));
			web3.eth.getBlockNumber().then(function(data){
				window.console.log(data);
				_this.value = data;
			});
		},
		setAdd:function(){this.execFunction = Calculator.add;},
		setSub:function(){this.execFunction = Calculator.sub;},
		setMul:function(){this.execFunction = Calculator.mul;},
		setDiv:function(){this.execFunction = Calculator.div;},
		calculate:function(){this.execFunction(this.contract,this);}
	},
	created(){
		this.contract = Calculator.getContract();
	}
}
</script>

<style>
</style>
