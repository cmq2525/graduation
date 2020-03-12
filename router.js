const Web3 = require('web3');
let web3 = new Web3('http://127.0.0.1:8545');

const axios = require('axios')
axios.defaults.baseURL = "http://127.0.0.1:9999";

const Platform = require('./Platform.js');
const Encrypt = require('./Encrypt.js')
const utils = require('./utils.js');

const express = require('express');
const router = express.Router();
let formidableMiddleware = require('express-formidable');

let myContract = Platform.getContract();
let myAddr = '0x86c923e0e2fad5862be4a552be46693ff84aa7cd';
let pwd = 'cmq19950520';
let userObj = {
}

const DATADIR = './data/';
router.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:8080');
    next();
})

router.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: '/Users/cmq2525/Desktop/file',//保存图片的目录
    multiples: true, // req.files to be arrays of files
    keepExtensions: true//保留后缀
}));

router.post('/api/login', async function (req, res) {
    let reqObj = req.fields;
    myAddr = reqObj.account;
    pwd = reqObj.pwd;
    userObj = await utils.loadUser(myAddr, pwd);
    utils.writeFile(userObj, DATADIR + myAddr + '.json');

    res.json({ execResult: 'suc' });
});

router.post('/api/sellDataset', async function (req, res) {
    let reqObj = req.fields;
    let price = Number(reqObj.price);
    let dataName = reqObj.dataName;
    let dataInfo = reqObj.dataInfo;
    let filePath = req.files.file.path;
    let response = await axios.get('/api/train_and_upload', {
        params: {
            data: filePath
        }
    });
    let modelAddr = response.data.modelAddr;
    let dataAddr = response.data.dataAddr;
    if (modelAddr === undefined) {
        res.json({ execResult: 'err', msg: 'Already Registered' });
    }
    Platform.sellData(myContract, myAddr, pwd,
        price, modelAddr, dataName, dataInfo).then(function (dataHash) {
            //待定
            userObj.sellList.push(dataHash);
            userObj.sellDict[dataHash] = {
                // price: price,
                // modelAddr: modelAddr,
                // dataName: dataName,
                // dataAddr: dataAddr,
                // dataInfo: dataInfo
                dataAddr: dataAddr
            };
            utils.writeFile(userObj, DATADIR + myAddr + '.json');
            res.json({ execResult: 'suc' });
        });
});
router.post('/api/customizeDataset', async function (req, res, next) {
    let reqObj = req.fields;
    let price = Number(reqObj.price);
    let dataName = reqObj.dataName;
    let dataInfo = reqObj.dataInfo;
    let filePath = req.files.file.path;

    let response = await axios.get('/api/train_and_upload', {
        params: {
            data: filePath
        }
    });
    let modelAddr = response.data.modelAddr;
    let dataAddr = response.data.dataAddr;

    if (modelAddr === undefined) {
        res.json({ execResult: 'err', msg: 'Already Registered!' });
        return;
    }
    console.log(modelAddr, dataAddr);
    Platform.customizeDataset(myContract, myAddr, pwd,
        price, modelAddr, dataName, dataInfo).then(function (customHash) {
            //待定
            console.log(userObj)
            userObj.customList.push(customHash);

            utils.writeFile(userObj, DATADIR + myAddr + '.json');
            res.json({ execResult: 'suc' });
        });
});
router.get('/api/getAllDataset', function (req, res) {
    Platform.getAllDataset(myContract).then(function (datasetList) {
        res.json({
            execResult: 'suc',
            datasetList: datasetList
        });
    });
});
router.get('/api/getAllCustom', function (req, res) {
    Platform.getAllCustom(myContract).then(function (customList) {
        res.json({
            execResult: 'suc',
            customList: customList
        });
    });
});
router.post('/api/customizedResponse', async function (req, res) {
    let reqObj = req.fields;
    let customHash = reqObj.customHash;
    let modelAddr = reqObj.modelAddr;

    let filePath = req.files.file.path;

    let response = await axios.get('/api/test_and_upload', {
        params: {
            data: filePath,
            modelAddr: modelAddr
        }
    });
    //文本信息不用传ipfs
    let responseAddr = response.data.testResult;
    let dataAddr = response.data.dataAddr;
    console.log(responseAddr);
    Platform.customizedResponse(myContract, myAddr, pwd,
        customHash, responseAddr).then(async function () {
            userObj.sellList.push(customHash);
            userObj.sellDict[customHash] = {
                dataAddr
            };
            utils.writeFile(userObj, DATADIR + myAddr + '.json');
            res.json({ execResult: 'suc' });
        });
})
router.post('/api/listingPhurchase', function (req, res) {
    let reqObj = req.fields;
    let price = Number(reqObj.price);
    let listing = true;
    // let listing = reqObj.listing;
    // //转化为布尔值
    // listing = Boolean(String(listing) == 'true');

    let targetData = reqObj.targetData;
    let owner = reqObj.owner;
    let keyObj = Encrypt.generateRSAKey();
    let pubKey = keyObj.pubKey;
    let priKey = keyObj.priKey;

    let txHash = Platform.getTxHash(listing, targetData, myAddr, owner);
    Platform.phurchaseRequest(myContract, myAddr, pwd,
        price, listing, targetData, owner, pubKey).then(function () {
            if (userObj.priKeyDict[txHash] != undefined) {
                res.json({ execResult: 'err', msg: 'Already Requested!' });
                return;
            }
            userObj.requestList.push(txHash);
            userObj.priKeyDict[txHash] = priKey;
            //if change then save
            utils.writeFile(userObj, DATADIR + myAddr + '.json');
            res.json({ execResult: 'suc' });
        });
});
router.post('/api/customPhurchase', async function (req, res) {
    let reqObj = req.fields;
    let targetCustom = reqObj.targetCustom;
    let owner = reqObj.owner;

    console.log('customPhurchase', reqObj)
    let customObj = await Platform.getCustomInfo(myContract, targetCustom);
    let price = customObj.price;
    let listing = false;

    let keyObj = Encrypt.generateRSAKey();
    let pubKey = keyObj.pubKey;
    let priKey = keyObj.priKey;
    let txHash = Platform.getTxHash(listing, targetCustom, myAddr, owner);
    Platform.phurchaseRequest(myContract, myAddr, pwd,
        price, listing, targetCustom, owner, pubKey).then(function () {
            if(userObj.priKeyDict[txHash] != undefined){
                res.json({ execResult: 'err', msg: 'Already Requested!' });
                return;
            }
            userObj.requestList.push(txHash);
            console.log('priKey:', priKey);
            userObj.priKeyDict[txHash] = priKey;
            //if change then save
            utils.writeFile(userObj, DATADIR + myAddr + '.json');
            res.json({ execResult: 'suc' });
        });
});

router.post('/api/phurchaseResponse', function (req, res) {
    let reqObj = req.fields;
    console.log('phurchaseResponse', reqObj)
    let targetData = reqObj.targetData;
    let listing = reqObj.listing;
    listing = Boolean(String(listing) == 'true');
    let buyer = reqObj.buyer;
    let pubKey = reqObj.pubKey;
    console.log(listing);
    console.log('targetData:', reqObj.targetData, targetData)
    console.log('buyer', reqObj.buyer, buyer);
    console.log(2)
    let txHash = Platform.getTxHash(listing, targetData, buyer, myAddr);
    console.log(3)
    let dataAddr = userObj.sellDict[targetData].dataAddr;
    let cipher = Encrypt.RSAEncrypt(pubKey, dataAddr);
    Platform.phurchaseResponse(myContract, myAddr, pwd, txHash, cipher).then(function () {
        res.json({ execResult: 'suc' });
    });
});

router.get('/api/checkCustomResponse', async function (req, res) {
    let reqObj = req.query;
    let targetCustom = reqObj.targetCustom;
    console.log('checkCustomResponse', reqObj)

    Platform.checkCustomResponse(myContract,
        targetCustom).then(function (responseList) {
            res.json({
                execResult: 'suc',
                responseList: responseList
            });
            console.log(responseList[0])
        });
});
router.get('/api/checkTxRequest', async function (req, res) {
    let reqObj = req.query;
    let targetData = reqObj.targetData;

    Platform.checkTxRequest(myContract,
        targetData).then(function (requestList) {
            res.json({
                execResult: 'suc',
                requestList: requestList
            });
        });
});
router.get('/api/checkTxResponse', async function (req, res) {
    let reqObj = req.query;
    let txHash = reqObj.txHash;

    Platform.checkTxResponse(myContract, txHash).then(async function (responseList) {
        if (responseList.length == 0) {
            res.json({
                execResult: 'suc',
                txResponse: {}
            });
            return;
        }
        let dataAddr = responseList[0].dataAddr;
        let priKey = userObj.priKeyDict[txHash];
        let txObj = await Platform.getTxInfo(myContract, txHash);
        let datasetObj = {};
        if (txObj.listing) {
            datasetObj = await Platform.getSellInfo(myContract, txObj.targetData);
            datasetObj.listing = true;
        }
        else {
            datasetObj = await Platform.getCustomInfo(myContract, txObj.targetData);
            datasetObj.listing = false;
        }
        datasetObj.dataAddr = Encrypt.RSADecrypt(priKey, dataAddr);
        datasetObj.dataHash = txObj.targetData;
        res.json({
            execResult: 'suc',
            txResponse: datasetObj
        });
    });
});

router.get('/api/refreshData', function (req, res) {
    let reqObj = req.query;
    let resObj = {};
    let paramsList = reqObj.paramsList;
    paramsList.forEach(function (param, index) {
        resObj[param] = userObj[param];
    });
    resObj.execResult = 'suc';
    res.json(resObj);
});

router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
module.exports = router

