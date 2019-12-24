const net = require('net');
const fs = require('fs');

var client = net.connect({port: 9999}, () => {
    console.log('连接服务器');
});
client.on('data', (data) => {
    console.log('接收服务端的数据: ', data.toString())
});
client.on('end', () => {
    console.log('断开连接')
});
client.on('error',(error)=>{console.log("error!");console.log(error);});


var account = "0x9c7c73af13ecb9fefac4def6e11a935dcda4ae15";
var pubFile = 'rsa-pub.pem';
var priFile = 'rsa-prv.pem';
var buy_pubKey = fs.readFileSync(pubFile,'utf8');
var buy_priKey = fs.readFileSync(priFile,'utf8');

/*
BUYER!!!!!!!!!!!
*/
function getAllDataset()
{
	var test = {
		'action':'getAllDataset',
		'args':[]
	};
	client.write(JSON.stringify(test));
}
function sendPhurchaseMoney(money,datasetHash,receiver,pubKey)
{
	var test = {
		'action':'sendPhurchaseMoney',
		'args':[money,datasetHash,
		receiver,pubKey]
	};
	client.write(JSON.stringify(test));
}
function getDatasetAddr(datasetHash,receiver,fileName)
{
	var test = {
		'action':'getDatasetAddr',
		'args':[datasetHash,
	 	 receiver, fileName]
	};
	client.write(JSON.stringify(test));
}
function retrievePhurchase(dataTxHash)
{
	var test = {
		'action':'retrievePhurchase',
		'args':[dataTxHash]
	};
	client.write(JSON.stringify(test));
}
// function downLoadDataset(dataTxHash,datasetHash,encodedAddr,fileName)
// {
// 	var test = {
// 		'action':'downLoadDataset',
// 		'args':[dataTxHash,datasetHash,
// 	 	 encodedAddr,fileName]
// 	};
// }

/*
SELLER!!!!!!!!!!!!!
*/
function sellDataset(dataName,dataInfo,sellPrice,fileName)
{
	var test = {
		'action':'sellDataset',
		'args':[dataName,dataInfo,
		        sellPrice,fileName]
	};	
	client.write(JSON.stringify(test));
}
function listenPhurchaseRequest(myAddr)
{
	var test = {
		"action":"listenPhurchaseRequest",
		"args":[myAddr]
	};
	client.write(JSON.stringify(test));
}
function uploadDataset(datasetHash,sender,pubKey)
{
	var test = {
		"action":"uploadDataset",
		"args":[datasetHash,sender,pubKey]
	};
	client.write(JSON.stringify(test));
}
function retrieveSale(datasetHash)
{
	var test = {
		'action':'retrieveSale',
		'args':[datasetHash]
	};
	client.write(JSON.stringify(test));
}

function countIncome(datasetHash)
{
	var test = {
		'action':'countIncome',
		'args':[datasetHash]
	};
	client.write(JSON.stringify(test));
}

var datasetHash = "0xf14abe16d1dcb402a29fab58f017435375bf244ad8d7a50268846eed4dcdd92a";
var dataTxHash = "0x23bb75be71fe8ed9dc216abe311a2bd4ec78df0ba9dd3321a9db824e11294312";
var account = "0x9c7c73af13ecb9fefac4def6e11a935dcda4ae15";


getAllDataset();
sendPhurchaseMoney(101,datasetHash,account,buy_pubKey);
getDatasetAddr(datasetHash,account,'myDataset.csv');

sellDataset("p","q",90,"wine");
sellDataset("pp","q",90,"wine");
sellDataset("ppp","q",90,"wine");
listenPhurchaseRequest(account);
uploadDataset(datasetHash,account,buy_pubKey);
countIncome(datasetHash);


