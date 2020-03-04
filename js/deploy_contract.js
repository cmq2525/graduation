var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
var Eth = require('web3-eth');
var eth = new Eth('http://localhost:8545');
var Personal = require('web3-eth-personal');
var personal = new Personal('http://localhost:8545');

var contractFile = require('./contract.json');
var this_name = "Platform";

var opcode = contractFile[this_name].opcode;
var abi = contractFile[this_name].abi;
var pub_address = contractFile[this_name].pub_address;
var a = '0x86c923e0e2fad5862be4a552be46693ff84aa7cd';
var pwd = 'cmq19950520';

var myContract = new web3.eth.Contract(abi, {
    from: a, // default from address
    data:opcode,
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
personal.unlockAccount(a,pwd).then(function(){
    console.log("successfully unlock");
    myContract.deploy({
        data:opcode,
        arguments:['0xac76a0786e57A4396c18a951a95e603c4300b236']
    }).send({from:a,gas:15000000,gasPrice:20000000}).then(function(newContractInstance){
        console.log(newContractInstance.options.address)
    });
});
