### 简介
本项目为以太坊上的数据交易平台，前端部分由Vue框架编写，逻辑处理部分主要由my_servr.js和trainModel.py构成。
### 环境配置
```npm install```
### 启动
首先需要连接至以太坊客户端，默认选择本地的客户端在8545端口提供的rpc服务：```geth --rpc --rpcaddr "0.0.0.0" --rpcport 8545 --ws --wsport 8546 --nodiscover --datadir "./nodedata1"  --port 30303 --rpcapi "db,eth,net,web3,personal" --rpccorsdomain "*" --minerthreads 1 --networkid 1001 --ipcdisable console 2>>geth1.log --allow-insecure-unlock ```
接下来启动web服务器：```node my_server.js```
就可以在7777端口访问用户界面。由于出售与购买时涉及到对机器学习模型的训练与测试，因此需要启动机器学习模块：```python trainModel.py```

### 修改
需要对```node_moudles/web3-eth-account/src/index.js```进行修改：
```Accounts.prototype.sign = function sign(data, privateKey) {
    //将这行注释掉，这样就是对原信息进行签名而不是包裹后的信息
    //var hash = this.hashMessage(data); 
    //对data而不是对hash进行签名
    var signature = Account.sign(data, privateKey);
    var vrs = Account.decodeSignature(signature);
    return {
        message: data,
        //这里注释与否无所谓
        //messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
};
```
