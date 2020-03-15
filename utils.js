const fs = require('fs');

const DATADIR = './data/'
const Zero = require(DATADIR + 'zero.json');

function copy(obj) {
    let tmp = JSON.stringify(obj);
    return JSON.parse(tmp);
}

function writeFile(data, fileName) {
    let str = JSON.stringify(data, "", "\t")
    fs.writeFile(fileName, str,function (err) {
        console.log(err);
    });
}

function isFileExisted(fileName) {
    return new Promise(function(resolve, reject) {
        fs.exists(fileName,function(exists){
            console.log('existed: ',exists)
            resolve(exists);
        });
    });
}


async function loadUser(account, pwd) {
    let result = {};
    let isExisted = await isFileExisted(DATADIR + account + '.json');
    if(isExisted){
        let data = fs.readFileSync(DATADIR + account + '.json','utf-8');
        result = JSON.parse(data.toString());
    }
    else{
        console.log('-----------')
        result = copy(Zero);
        result.account = account;
        result.pwd = pwd;
    }
    console.log(result)
    return result;
}

module.exports = {
    copy, writeFile,isFileExisted , loadUser
}