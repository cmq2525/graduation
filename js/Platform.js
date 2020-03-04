const Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:8545');

// var my_addr = "0x86c923e0e2fad5862be4a552be46693ff84aa7cd"
// var pwd = "cmq19950520"


function getContract(){
	var abi = [{"inputs":[{"internalType":"address","name":"Addr","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"targetData","type":"bytes32"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"responseAddr","type":"string"}],"name":"customResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"targetData","type":"bytes32"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bool","name":"listing","type":"bool"},{"indexed":false,"internalType":"string","name":"pubKey","type":"string"}],"name":"txRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"string","name":"dataAddr","type":"string"}],"name":"txResponse","type":"event"},{"inputs":[{"internalType":"bytes32","name":"h","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"check","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"h","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"checkSign","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"h","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"check_check","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"modelAddr","type":"string"},{"internalType":"string","name":"dataInfo","type":"string"}],"name":"customizedPhurchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"phurchaseHash","type":"bytes32"},{"internalType":"string","name":"responseAddr","type":"string"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"customizedResponse","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"txHash","type":"bytes32"}],"name":"isFinished","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"phurchaseDict","outputs":[{"internalType":"bool","name":"stillNeed","type":"bool"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"modelAddr","type":"string"},{"internalType":"string","name":"dataInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phurchaseLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"phurchaseList","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"listing","type":"bool"},{"internalType":"bytes32","name":"targetData","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"pubKey","type":"string"}],"name":"phurchaseRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"txHash","type":"bytes32"},{"internalType":"string","name":"dataAddr","type":"string"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"phurchaseResponse","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"phurchaseHash","type":"bytes32"}],"name":"retrieveCustom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"txHash","type":"bytes32"}],"name":"retrievePhurchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"sellHash","type":"bytes32"}],"name":"retrieveSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"modelAddr","type":"string"},{"internalType":"string","name":"dataName","type":"string"},{"internalType":"string","name":"dataInfo","type":"string"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"sellDataset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"sellDict","outputs":[{"internalType":"bool","name":"onSale","type":"bool"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"modelAddr","type":"string"},{"internalType":"string","name":"dataName","type":"string"},{"internalType":"string","name":"dataInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sellLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sellList","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"txDict","outputs":[{"internalType":"bool","name":"finished","type":"bool"},{"internalType":"bool","name":"listing","type":"bool"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bytes32","name":"targetData","type":"bytes32"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"}];
	var address = '0x20cE0Eb37214E6b2e1be7db27c2d2D40FDB032A6';
	var myContract = new web3.eth.Contract(abi, {
			gasPrice: '20000' 
	});
	myContract.options.address = address;
	return myContract;    
}


function sellData(myContract,my_addr,pwd,price,modelAddr,dataName,dataInfo)
{
		//window.console.log(my_addr,price,modelAddr,dataInfo);
    var sha = web3.utils.soliditySha3(my_addr,price,modelAddr,dataInfo);
		var pri_key = '0x2533d8712b12382a629105fcea607c64ec97bc246413059c5bfbb3742540a42a';
		//var pub_addr = '0xac76a0786e57A4396c18a951a95e603c4300b236';
		var sig = web3.eth.accounts.sign(sha,pri_key);
    var v = sig.v;
    var r = sig.r;
    var s = sig.s;
		return new Promise((resolve,reject) =>{
			web3.eth.personal.unlockAccount(my_addr,pwd).then(function(){
				myContract.methods.sellDataset(price,modelAddr,dataName,dataInfo,v,r,s).send({
					from:my_addr,gas:2000000}).then(function(){
						resolve(sha);
					});
				}).catch((err)=>{reject(err)});
		});
    // web3.eth.personal.unlockAccount(my_addr,pwd).then(function(){
    //     myContract.methods.sellDataset(price,modelAddr,dataName,dataInfo,v,r,s).send({
    //         from:my_addr,gas:2000000}).then(function(){
				// 			window.console.log('suc');
				// 			myContract.methods.sellLength().call().then(function(length){
				// 				window.console.log(length)
				// 				myContract.methods.sellList(length-1).call().then(function(hash){
				// 					myContract.methods.sellDict(hash).call().then(window.console.log);
				// 				});
				// 			});
				// 		});
    // });
    
}
function getAllDataset(myContract,datasetList){
    myContract.methods.sellLength().call().then(async function(length){
        if(length>datasetList.length){
            for(var i=datasetList.length;i<length;i++){
              await myContract.methods.sellList(i).call().then(function(datahash){
								myContract.methods.sellDict(datahash).call().then(function(dataset){
									dataset['datasetHash'] = datahash;
									datasetList.push(dataset);
								});
							});
            }
        }
				//datasetList.reverse();
				
    });
}
function getTxHash(listing,targetData,buyer,owner){
	return web3.utils.soliditySha3(listing,targetData,buyer,owner);
}
function phurchaseRequest(myContract,my_addr,pwd,price,listing,targetData,owner,pubKey){
	return new Promise(function(resolve,reject){
		web3.eth.personal.unlockAccount(my_addr,pwd).then(function(){
			myContract.methods.phurchaseRequest(listing,targetData,owner,pubKey).send({
				from:my_addr,gas:1000000,value:price
			}).then(function(){
				window.console.log('suc');
				var txHash = web3.utils.soliditySha3(listing,targetData,my_addr,owner);
				resolve(txHash);
				});
		}).catch(function(err){reject(err);});
	});
		
}
function phurchaseResponse(myContract,my_addr,pwd,listing,targetData,buyer,dataAddr)
{
	var txHash = web3.utils.soliditySha3(listing,targetData,buyer,my_addr);
	var pri_key = '0x2533d8712b12382a629105fcea607c64ec97bc246413059c5bfbb3742540a42a';
	var sha = web3.utils.soliditySha3(txHash,dataAddr);
	var sig = web3.eth.accounts.sign(sha,pri_key);
	var v = sig.v;
	var r = sig.r;
	var s = sig.s;
	web3.eth.personal.unlockAccount(my_addr,pwd).then(function(){
		myContract.methods.phurchaseResponse(txHash,dataAddr,v,r,s).send({
			from:my_addr,gas:2000000}).then(function(){
				window.console.log('suc');
			});
		});
}
function checkTxRequest(myContract,targetData,fromBlock){
	var requestList = [];
	return new Promise(function(resolve,reject){
		web3.eth.getBlockNumber().then(function(toBlock){
			myContract.getPastEvents('txRequest',{
				filter:{targetData:targetData},
				fromBlock:fromBlock,
				toBlock:toBlock
			}).then(function(events){
				fromBlock = toBlock;
				for(var event of events){
						requestList.push(event.returnValues);
				}
				resolve(requestList);
			}).catch(function(err){reject(err);});
		});
	});
		
}

function checkTxResponse(myContract,txHash,fromBlock){
	var responseList = [];
	return new Promise(function(resolve,reject){
		web3.eth.getBlockNumber().then(function(toBlock){
			myContract.getPastEvents('txResponse',{
				filter:{txHash:txHash},
				fromBlock:fromBlock,
				toBlock:toBlock
			}).then(function(events){
				fromBlock = toBlock;
				for(var event of events){
					responseList.push(event.returnValues);
				}
				resolve(responseList);
			}).catch(function(err){reject(err);});
    });
	});
		
}

module.exports = {
	getContract,
	sellData,
	getAllDataset,
	getTxHash,
	phurchaseRequest,
	phurchaseResponse,
	checkTxRequest,
	checkTxResponse
}