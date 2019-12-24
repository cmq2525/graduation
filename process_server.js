var fs = require("fs");
var file = "smartContractInfo.json";

var root = JSON.parse(fs.readFileSync(file));
var contract = root["platform"];
var abi = contract["abi"];
var opcode = contract["opcode"];
var address = contract["address"];

var childProcess = require('child_process');


var Web3 = require("web3");
var Eth = require("web3-eth");
var Personal = require("web3-eth-personal");

var geth_address = "ws://localhost:8546";
var web3 = new Web3(geth_address);
var eth = new Eth(geth_address);
var personal = new Personal(geth_address);


var testContract = new web3.eth.Contract(abi,{});
testContract.options.address = address;


var sell_privateKey = "0x1657b59d4635409246d1d4558f3414a59b12b9906a260d9079cf228eb71c3628";
var sell_secretKey = "woaixuexi";

var account = "0x9c7c73af13ecb9fefac4def6e11a935dcda4ae15";
var pwd = "cmq19950520";
//RSA key pair;
var pubFile = 'rsa-pub.pem';
var priFile = 'rsa-prv.pem';

var buy_pubKey = fs.readFileSync(pubFile,'utf8');
var buy_priKey = fs.readFileSync(priFile,'utf8');

var datasetOnSale = 'datasetOnSale.json';
/*
以上是连接智能合约的准备工作！！！！！
*/

const net = require("net")
const server = net.createServer((socket) => {
    console.log("客户端连接")

    socket.on("data", (data) => {
        processData(data.toString(),socket);
    });

    socket.on("end", (data) => {
        console.log("客户端断开连接")
        socket.end();
    });
    socket.on("error",(err)=>{
        console.log(err);
        console.log("发生错误");
        socket.end();
    })
})
server.listen(9999, () => {
    console.log("服务创建")
});

var action_dict = {}
action_dict["updateArgs"] = updateArgs;

action_dict["getAllDataset"] = getAllDataset;
action_dict["getNewDataset"] = getNewDataset;
action_dict["getDatasetAddr"] = getDatasetAddr;
action_dict["sendPhurchaseMoney"] = sendPhurchaseMoney;
action_dict["retrievePhurchase"] = retrievePhurchase;
action_dict["downLoadDataset"] = downLoadDataset;
//--------------

action_dict["sellDataset"] = sellDataset;
action_dict["register"] = register;
action_dict["listenPhurchaseRequest"] = listenPhurchaseRequest;
action_dict["retrieveSale"] = retrieveSale;
action_dict["uploadDataset"] = uploadDataset;
//action_dict["receivePhurchaseMoney"] = receivePhurchaseMoney;


/*
以上是启动服务器的准备工作！！！！！！！
*/
const crypto = require("crypto");

function aesEncrypt(key, data) {
    const cipher = crypto.createCipher("aes192", key);
    var crypted = cipher.update(data, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
}

function aesDecrypt(key, encrypted) {
    const decipher = crypto.createDecipher("aes192", key);
    var decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}


/*
以上是用到的一些其他的库！！！
*/

function processData(raw_data,socket)
{
    var data = JSON.parse(raw_data);
    console.log(data);
    if(data["action"]=="END")
    {
        socket.end();
        server.close();
    }
    else
    {
        //如果定义了动作对应的函数，则执行对应的函数。
        if (action_dict[data["action"]])
        {
            action_dict[data["action"]](data["args"],socket);
        }
    }
}

function updateArgs(args,socket)
{
    sell_privateKey = args[0];
    account = args[1];
    pwd = args[2];
    var pubFile = args[3];
    var priFile = args[4];

    buy_pubKey = fs.readFileSync(pubFile,'utf8')
    buy_priKey = fs.readFileSync(priFile,'utf8')

    var response = "updateArgs successfully!";
    socket.write(response);
}

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
下面的是buyer执行的函数
*/
function getAllDataset(args,socket)
{
    //得到所有的dataset地址，并将其保存。
    var fileAddr = args[0];
    var response = "getAllDataset successfully!";

    if(!fileAddr)
        fileAddr = "./dataInfo.json";
    var result = [];
    testContract.methods.getListLength().call().then(async function(length){
        for(var i=0;i<length;i++)
        {
            var promise = new Promise(function(resolve,reject){
                testContract.methods.sell_list(i).call().then((datasetHash)=>{
                    testContract.methods.sell_dict(datasetHash).call().then((result)=>{
                        var obj_length = Object.keys(result).length;
                        for(var j=0;j<Math.floor(obj_length/2);j++)
                        {
                            
                            delete result[j];
                        }
                        result["datasetHash"] = datasetHash;
                        resolve(result);
                    });
                });
            });
            await promise.then((data)=>{result.push(data);
                console.log(result);
                console.log("---------------")
            });
        }
        fs.writeFileSync(fileAddr,JSON.stringify(result,"","\t"));
        response += fileAddr;
        socket.write(response);
    });
}

function getNewDataset(args,socket)
{
    //得到所有的dataset地址，并将其保存。
    var fileAddr = args[0];
    var response = "";

    if(!fileAddr)
        fileAddr = "./dataInfo.json";
    result = JSON.parse(fs.readFileSync(fileAddr).toString());
    var tmp_length = result.length;

    testContract.methods.getListLength().call().then(async function(length){
        for(var i=tmp_length;i<length;i++)
        {
            var promise = new Promise(function(resolve,reject){
                testContract.methods.sell_list(i).call().then((datasetHash)=>{
                    testContract.methods.sell_dict(datasetHash).call().then((result)=>{
                        var obj_length = Object.keys(result).length;
                        for(var j=0;j<Math.floor(obj_length/2);j++)
                        {                            
                            delete result[j];
                        }
                        result["datasetHash"] = datasetHash;
                        resolve(result);
                    });
                });
            });
            await promise.then((data)=>{result.push(data);});
        }
        fs.writeFileSync(fileAddr,JSON.stringify(result,"","\t"));
        response += "getNewDataset successfully!";
        socket.write(response);
    })
}
function sendPhurchaseMoney(args,socket)
{
    var money = args[0];
    var datasetHash = args[1];
    var receiver = args[2];
    var pubKey = args[3];

    var response = "sendPhurchaseMoney successfully!";

    personal.unlockAccount(account,pwd).then(()=>{
        testContract.methods.sendPhurchaseMoney(datasetHash,account,receiver,
            pubKey).send({from:account,gas:4700000,value:money}).then(()=>{
                console.log("sendPhurchaseMoney successfully!");
                socket.write(response);
            });
    });
}

function getDatasetAddr(args,socket)
{
    var datasetHash = args[0];
    var receiver = args[1];
    var fileName = args[2];

    var dataTxHash = web3.utils.soliditySha3(datasetHash,account,receiver);
    var response = "getDatasetAddr successfully!";
    testContract.getPastEvents("phurchaseResponse",{
        filter:{dataTxHash:dataTxHash},
        fromBlock:0,
        toBlock:"latest"
    }).then(function(events){
        if(events.length!=0)
        {
            var encodedAddr = events[0].returnValues["encodedAddr"];
            console.log("encodedAddr:",encodedAddr);
            downLoadDataset([dataTxHash,datasetHash,encodedAddr,fileName],socket);

        }
        else
        {
            //没找到就监听
            testContract.events.phurchaseResponse({
                filter:{dataTxHash:dataTxHash}
            }).on("data",function(event){
                    var encodedAddr = event.returnValues["encodedAddr"];
                    console.log("encodedAddr:",encodedAddr);
                    downLoadDataset([dataTxHash,datasetHash,encodedAddr,fileName],socket);
                });
        }  
    })
}
function downLoadDataset(args,socket)
{
    var dataTxHash = args[0];
    var datasetHash = args[1];
    var encodedAddr = args[2];
    var fileName = args[3];

    var response = "getDatasetAddr successfully!";
    var datasetAddr = aesDecrypt(sell_secretKey,crypto.privateDecrypt(Buffer.from(buy_priKey,'utf8'),Buffer.from(encodedAddr,'hex')).toString('utf8'));
    console.log("datasetAddr:",datasetAddr)
    result = childProcess.execSync("ipfs cat " + datasetAddr + " > " + fileName).toString();
    // verify transaction
    personal.unlockAccount(account,pwd).then(()=>{
        testContract.methods.verifyPhurchase(dataTxHash).send({from:account,gas:4700000}).then(()=>{
            console.log("getDatasetAddr successfully!");
            socket.write(response);
        });
    })

}

function retrievePhurchase(args,socket)
{
    var datasetHash = args[0];
    var receiver = args[1];
    
    var dataTxHash = web3.utils.soliditySha3(datasetHash,account,receiver);
    var response = "retrieve_phurchase successfully!";
    personal.unlockAccount(account,pwd).then(()=>{
        testContract.methods.retrieve_phurchase(dataTxHash).send({from:account,gas:4700000}).then(()=>{console.log("retrieve_phurchase successfully!");
            socket.write(response);
        });
    })
}
/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
下面的是seller执行的函数
*/
function sellDataset(args,socket)
{
    var dataName = args[0];
    var dataInfo = args[1];
    var sellPrice = args[2];
    var dataFile = args[3];

    var result;
    result = childProcess.execSync("python trainModel.py -l " + dataFile);
    result = childProcess.execSync("ipfs add " + dataFile + ".pkl").toString();
    var modelAddr = result.split(" ")[1];

    result = childProcess.execSync("ipfs add " + dataFile + ".csv").toString();
    var datasetAddr = result.split(" ")[1];
    var cipher = aesEncrypt(sell_secretKey,datasetAddr);

    var datasetHash = web3.utils.soliditySha3(account,dataName,dataInfo,modelAddr,sellPrice);

    var obj = JSON.parse(fs.readFileSync(datasetOnSale));
    obj[datasetHash] = [datasetAddr,cipher];
    fs.writeFileSync(datasetOnSale,JSON.stringify(obj,"","\t"));


    args[2] = modelAddr;
    args[3] = sellPrice;
    register(args,socket);
}

function register(args,socket)
{
    var dataName = args[0];
    var dataInfo = args[1];
    var modelAddr = args[2];
    var sellPrice = args[3];
    var response = "register successfully!";

    var sha = web3.utils.soliditySha3(modelAddr);
    var sig = eth.accounts.sign(sha,sell_privateKey);
    var v = sig["v"];
    var r = sig["r"];
    var s = sig["s"];

    personal.unlockAccount(account,pwd).then(()=>{
        testContract.methods.register(dataName,dataInfo,modelAddr,
            sellPrice,v,r,s).send({from:account,gas:4700000}).then(()=>{
                testContract.methods.getListLength().call().then((data)=>{console.log("The list length is:",data)});
                console.log("Register successfully!");
                socket.write(response);
            });
    });
}

function listenPhurchaseRequest(args,socket)
{
    var myAddr = args[0];
    var response = "listenPhurchaseRequest successfully!";

    testContract.events.phurchaseRequest({
        filter:{seller:myAddr}
    }).on("data",function(event){
        var dataTxHash = event.returnValues['dataTxHash'];
        testContract.methods.phurchase_dict(dataTxHash).call().then((result)=>{
            console.log("")
            var datasetHash = result['datasetHash'];
            var sender = result['sender'];
            var pubKey = result['pubKey'];
            uploadDataset([datasetHash,sender,pubKey],socket);
        });
    });
}

// function listenPhurchaseRequest(args,socket)
// {
//     var myAddr = args[0];
//     var response = "listenPhurchaseRequest successfully!";
//     testContract.events.phurchaseRequest({
//         filter:{seller:myAddr}
//     }).on("data",function(event){
//         var result = {"sender":event.returnValues["sender"],
//                       "datasetHash":event.returnValues["datasetHash"],
//                       "pubKey":event.returnValues["pubKey"]};
//         socket.write(response + JSON.stringify(event.returnValues));
//     })
// }
function uploadDataset(args,socket)
{
    var datasetHash = args[0];
    var sender = args[1];
    var pubKey = args[2];
    var response = "uploadDataset successfully!"
    var root = JSON.parse(fs.readFileSync(datasetOnSale))[datasetHash];
    //事实上这里的datasetAddr是经过aes加密后的
    if(aesEncrypt(sell_secretKey,root[0])!=root[1])
        return;

    var encodedAddr = crypto.publicEncrypt(Buffer.from(pubKey,'utf8'), Buffer.from(root[1],'utf8')).toString('hex');
    var dataTxHash = web3.utils.soliditySha3(datasetHash,sender,account);
    var sha = web3.utils.soliditySha3(dataTxHash,encodedAddr);
    var sig = eth.accounts.sign(sha,sell_privateKey);
    var v = sig["v"];
    var r = sig["r"];
    var s = sig["s"];
    personal.unlockAccount(account,pwd).then(()=>{
        testContract.methods.uploadDataset(dataTxHash,encodedAddr,v,r,s).send({from:account,gas:470000}).then(()=>{
                console.log("uploadDataset successfully!");
                socket.write(response);
            });
    });
}
function countIncome(args,socket)
{
    var datasetHash = args[0];
    var count = 0;
    var response = "countIncome successfully!";
    testContract.getPastEvents("recordMoney",{
        filter:{datasetHash:datasetHash},
        fromBlock:0,
        toBlock:"latest"
    }).then(function(events){
        for(var i=0;i<events.length;i++)
        {
            count += parseInt(events[i].returnValues['money']);
        }
        socket.write(response+count);
   });
}

function retrieveSale(args,socket)
{
    var datasetHash = args[0];
    var response = "retrieve_sale successfully!";
    personal.unlockAccount(account,pwd).then(()=>{
        testContract.methods.retrieveSale(datasetHash).send({from:account,gas:4700000}).then(()=>{
            console.log("retrieve_sale successfully!");
            socket.write(response);
        });
    })
}


