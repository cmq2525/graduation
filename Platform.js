const Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:8545');

// var my_addr = "0x86c923e0e2fad5862be4a552be46693ff84aa7cd"
// var pwd = "cmq19950520"

function getContract() {
	var abi = [{ "inputs": [{ "internalType": "address", "name": "Addr", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "targetCustom", "type": "bytes32" }, { "indexed": false, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": false, "internalType": "string", "name": "responseAddr", "type": "string" }], "name": "customResponse", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "targetData", "type": "bytes32" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "listing", "type": "bool" }, { "indexed": false, "internalType": "string", "name": "pubKey", "type": "string" }], "name": "txRequest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "dataAddr", "type": "string" }], "name": "txResponse", "type": "event" }, { "inputs": [{ "internalType": "bytes32", "name": "h", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }, { "internalType": "address", "name": "addr", "type": "address" }], "name": "checkSign", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "customDict", "outputs": [{ "internalType": "bool", "name": "stillNeed", "type": "bool" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string", "name": "modelAddr", "type": "string" }, { "internalType": "string", "name": "dataName", "type": "string" }, { "internalType": "string", "name": "dataInfo", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "customLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "customList", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string", "name": "modelAddr", "type": "string" }, { "internalType": "string", "name": "dataName", "type": "string" }, { "internalType": "string", "name": "dataInfo", "type": "string" }], "name": "customizeDataset", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "customHash", "type": "bytes32" }, { "internalType": "string", "name": "responseAddr", "type": "string" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "customizedResponse", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "txHash", "type": "bytes32" }], "name": "isFinished", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "listing", "type": "bool" }, { "internalType": "bytes32", "name": "targetData", "type": "bytes32" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "string", "name": "pubKey", "type": "string" }], "name": "phurchaseRequest", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "txHash", "type": "bytes32" }, { "internalType": "string", "name": "dataAddr", "type": "string" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "phurchaseResponse", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "customHash", "type": "bytes32" }], "name": "retrieveCustom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "txHash", "type": "bytes32" }], "name": "retrievePhurchase", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "sellHash", "type": "bytes32" }], "name": "retrieveSale", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string", "name": "modelAddr", "type": "string" }, { "internalType": "string", "name": "dataName", "type": "string" }, { "internalType": "string", "name": "dataInfo", "type": "string" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "sellDataset", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "sellDict", "outputs": [{ "internalType": "bool", "name": "onSale", "type": "bool" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string", "name": "modelAddr", "type": "string" }, { "internalType": "string", "name": "dataName", "type": "string" }, { "internalType": "string", "name": "dataInfo", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "sellLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "sellList", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "txDict", "outputs": [{ "internalType": "bool", "name": "finished", "type": "bool" }, { "internalType": "bool", "name": "listing", "type": "bool" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "bytes32", "name": "targetData", "type": "bytes32" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }], "stateMutability": "view", "type": "function" }];
	var address = '0x3D6D8C59F6ea394EF6a3EEe62A2C154B5B9737e9';
	var myContract = new web3.eth.Contract(abi, {
		gasPrice: '20000'
	});
	myContract.options.address = address;
	return myContract;
}
//var myContract = getContract();

function sellData(myContract, my_addr, pwd, price, modelAddr, dataName, dataInfo) {
	var sha = web3.utils.soliditySha3(my_addr, price, modelAddr, dataInfo);
	var pri_key = '0x2533d8712b12382a629105fcea607c64ec97bc246413059c5bfbb3742540a42a';
	//var pub_addr = '0xac76a0786e57A4396c18a951a95e603c4300b236';
	var sig = web3.eth.accounts.sign(sha, pri_key);
	var v = sig.v;
	var r = sig.r;
	var s = sig.s;
	return new Promise(function (resolve, reject) {
		web3.eth.personal.unlockAccount(my_addr, pwd).then(function () {
			myContract.methods.sellDataset(price, modelAddr, dataName, dataInfo, v, r, s).send({
				from: my_addr, gas: 2000000
			}).then(function () {
				console.log('sellData suc');
				resolve(sha);
			});
		}).catch((err) => { reject(err) });
	});
}
function customizeDataset(myContract, my_addr, pwd, price, modelAddr, dataName, dataInfo) {
	var sha = web3.utils.soliditySha3(my_addr, price, modelAddr, dataInfo);
	return new Promise(function (resolve, reject) {
		web3.eth.personal.unlockAccount(my_addr, pwd).then(function () {
			myContract.methods.customizeDataset(price, modelAddr, dataName, dataInfo).send({
				from: my_addr, gas: 2000000
			}).then(function () {
				console.log('customizeDataset suc');
				resolve(sha);
			});
		}).catch((err) => { reject(err) });
	});
}
function customizedResponse(myContract, my_addr, pwd, phurchaseHash, responseAddr) {
	var sha = web3.utils.soliditySha3(phurchaseHash, responseAddr, my_addr);
	var pri_key = '0x2533d8712b12382a629105fcea607c64ec97bc246413059c5bfbb3742540a42a';
	var sig = web3.eth.accounts.sign(sha, pri_key);
	var v = sig.v;
	var r = sig.r;
	var s = sig.s;
	return new Promise(function (resolve, reject) {
		web3.eth.personal.unlockAccount(my_addr, pwd).then(function () {
			myContract.methods.customizedResponse(phurchaseHash, responseAddr, v, r, s).send({
				from: my_addr, gas: 2000000
			}).then(function () {
				console.log('customizedResponse suc');
				resolve();
			});
		}).catch((err) => { reject(err) });
	});
}

function getAllDataset(myContract) {
	return new Promise(function (resolve, reject) {
		var datasetList = [];
		myContract.methods.sellLength().call().then(async function (length) {
			if (length > datasetList.length) {
				for (var i = 0; i < length; i++) {
					var dataHash = await myContract.methods.sellList(i).call();
					var datasetObj = await myContract.methods.sellDict(dataHash).call()
					datasetObj['dataHash'] = dataHash;
					datasetList.push(datasetObj);
				}
			}
			console.log('getAllDataset suc');
			resolve(datasetList);
		}).catch(function (err) {
			reject(err);
		});
	});
}
function getAllCustom(myContract) {
	return new Promise(function (resolve, reject) {
		let customList = [];
		myContract.methods.customLength().call().then(async function (length) {
			if (length > customList.length) {
				for (var i = 0; i < length; i++) {
					let customHash = await myContract.methods.customList(i).call();
					let customObj = await myContract.methods.customDict(customHash).call()
					customObj['customHash'] = customHash;
					customList.push(customObj);
				}
			}
			console.log('getAllCustom suc');
			resolve(customList);
		}).catch(function (err) {
			reject(err);
		});
	});
}
function getTxHash(listing, targetData, buyer, owner) {
	return web3.utils.soliditySha3(listing, targetData, buyer, owner);
}
function getSellInfo(myContract, dataHash) {
	return myContract.methods.sellDict(dataHash).call();
}
function getCustomInfo(myContract, customHash) {
	return myContract.methods.customDict(customHash).call();
}
function getTxInfo(myContract, txHash) {
	return myContract.methods.txDict(txHash).call();
}

function phurchaseRequest(myContract, my_addr, pwd, price, listing, targetData, owner, pubKey) {
	return new Promise(function (resolve, reject) {
		web3.eth.personal.unlockAccount(my_addr, pwd).then(function () {
			myContract.methods.phurchaseRequest(listing, targetData, owner, pubKey).send({
				from: my_addr, gas: 1000000, value: price
			}).then(function () {
				var txHash = web3.utils.soliditySha3(listing, targetData, my_addr, owner);
				console.log('phurchaseRequest suc');
				resolve(txHash);
			});
		}).catch(function (err) { reject(err); });
	});

}
function phurchaseResponse(myContract, my_addr, pwd, txHash, dataAddr) {
	return new Promise(function (resolve, reject) {
		var sha = web3.utils.soliditySha3(txHash, dataAddr);
		var pri_key = '0x2533d8712b12382a629105fcea607c64ec97bc246413059c5bfbb3742540a42a';
		var sig = web3.eth.accounts.sign(sha, pri_key);
		var v = sig.v;
		var r = sig.r;
		var s = sig.s;
		web3.eth.personal.unlockAccount(my_addr, pwd).then(function () {
			myContract.methods.phurchaseResponse(txHash, dataAddr, v, r, s).send({
				from: my_addr, gas: 2000000
			}).then(function () {
				console.log('phurchaseResponse suc');
				resolve();
			});
		}).catch(function (err) {
			reject(err);
		});
	});

}
function checkCustomResponse(myContract, targetCustom){
	return new Promise(function (resolve, reject) {
		var responseList = [];
		myContract.getPastEvents('customResponse', {
			filter: { targetCustom: targetCustom },
			fromBlock: 0,
			toBlock: 'latest'
		}).then(async function (events) {
			for (let event of events) {
				//检测交易是否已经结束
				let owner = event.returnValues.owner;
				let responseAddr = event.returnValues.responseAddr;
				//responseAddr = responseAddr.replace(/\n/gm,"<br>");
				responseList.push({
					targetCustom:targetCustom,
					owner:owner,
					responseAddr:responseAddr
				});
			}
			resolve(responseList);
		}).catch(function (err) { reject(err); });
	});
}

function checkTxRequest(myContract, targetData) {
	return new Promise(function (resolve, reject) {
		var requestList = [];
		myContract.getPastEvents('txRequest', {
			filter: { targetData: targetData },
			fromBlock: 0,
			toBlock: 'latest'
		}).then(async function (events) {
			for (var event of events) {
				//检测交易是否已经结束
				var buyer = event.returnValues.buyer;
				var owner = event.returnValues.owner;
				var listing = event.returnValues.listing;
				var pubKey = event.returnValues.pubKey;
				var txHash = getTxHash(listing, targetData, buyer, owner);
				var txInfo = await getTxInfo(myContract, txHash);
				if (!txInfo.finished) {
					requestList.push({
						targetData: targetData,
						buyer: buyer,
						listing: listing,
						pubKey: pubKey
					});
				}
			}
			console.log('checkTxRequest suc');
			resolve(requestList);
		}).catch(function (err) { reject(err); });
	});
}

function checkTxResponse(myContract, txHash) {
	return new Promise(function (resolve, reject) {
		var responseList = [];
		myContract.getPastEvents('txResponse', {
			filter: { txHash: txHash },
			fromBlock: 0,
			toBlock: 'latest'
		}).then(function (events) {
			for (var event of events) {
				responseList.push(event.returnValues);
			}
			//这里可能会有无数个响应，我们先把所有的都保存，默认只使用第一个
			console.log('checkTxResponse suc')
			resolve(responseList);
		}).catch(function (err) { reject(err); });
	});
}

module.exports = {
	getContract,
	sellData,
	customizeDataset,
	customizedResponse,
	getAllDataset,
	getAllCustom,
	getTxHash,
	getSellInfo,
	getCustomInfo,
	getTxInfo,
	phurchaseRequest,
	phurchaseResponse,
	checkCustomResponse,
	checkTxRequest,
	checkTxResponse,
}