pragma solidity >=0.4.22 <0.7.0;
contract Platform
{
    address secretAddr;
    
    event txRequest(bytes32 indexed targetData,address buyer,address owner, bool listing, string pubKey);
    event txResponse(bytes32 indexed txHash,string dataAddr);
    event customResponse(bytes32 indexed targetCustom, address owner,string responseAddr);
    
    struct SellInfo{
        bool onSale;
        address owner;
        uint256 price;
        string modelAddr;
        string dataName;
        string dataInfo;
    }
    struct CustomInfo{
        bool stillNeed;
        address buyer;
        uint256 price;
        string modelAddr;
        string dataName;
        string dataInfo;
    }
    struct TxInfo{
        bool finished;
        bool listing;
        uint256 price;
        bytes32 targetData;
        address buyer;
        address owner;
    }
    
    mapping(bytes32=>SellInfo) public sellDict;
    mapping(bytes32=>CustomInfo) public customDict;
    mapping(bytes32=>TxInfo) public txDict;
    
    mapping(uint256=>bytes32) public sellList;
    mapping(uint256=>bytes32) public customList;
    
    uint256 public sellLength;
    uint256 public customLength;
    
    constructor(address Addr) public{
        secretAddr = Addr;
        sellLength = 0;
        customLength = 0;
    }
    function checkSign(bytes32 h, uint8 v, bytes32 r, bytes32 s,address addr) public returns (bool) {
    //   bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    //   bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, h));
       return addr == ecrecover(h, v, r, s);
    }

    function sellDataset(uint256 price, string memory modelAddr, string memory dataName, string memory dataInfo, uint8 v, bytes32 r,bytes32 s) public{
        bytes32 sellHash = keccak256(abi.encodePacked(msg.sender,price,modelAddr,dataInfo));
        //Only record once
        require(sellDict[sellHash].owner != msg.sender);
        
        require(checkSign(sellHash,v,r,s,secretAddr));
        SellInfo memory sellItem;
        sellItem.onSale = true;
        sellItem.owner = msg.sender;
        sellItem.price = price;
        sellItem.modelAddr = modelAddr;
        sellItem.dataName = dataName;
        sellItem.dataInfo = dataInfo;
        
        sellDict[sellHash] = sellItem;
        sellList[sellLength] = sellHash;
        sellLength += 1;
    }
    function customizeDataset(uint256 price,string memory modelAddr, string memory dataName, string memory dataInfo) public{
        bytes32 customHash = keccak256(abi.encodePacked(msg.sender,price,modelAddr,dataInfo));
        //Only record once
        require(customDict[customHash].buyer != msg.sender);
        
        CustomInfo memory customItem;
        customItem.stillNeed = true;
        customItem.buyer = msg.sender;
        customItem.price = price;
        customItem.modelAddr = modelAddr;
        customItem.dataName = dataName;
        customItem.dataInfo = dataInfo;
        
        customDict[customHash] = customItem;
        customList[customLength] = customHash;
        customLength += 1;
    }
    function retrieveSale(bytes32 sellHash) public{
        require(sellDict[sellHash].owner==msg.sender);
        sellDict[sellHash].onSale = false;
    }
    function retrieveCustom(bytes32 customHash) public{
        require(customDict[customHash].buyer==msg.sender);
        customDict[customHash].stillNeed = false;
    }
    function retrievePhurchase(bytes32 txHash) public{
        require(txDict[txHash].finished==false);
        require(txDict[txHash].buyer==msg.sender);
        msg.sender.transfer(txDict[txHash].price);
        txDict[txHash].finished = true;
    }
    
    function customizedResponse(bytes32 customHash,string memory responseAddr, uint8 v, bytes32 r, bytes32 s) public {
        bytes32 hash = keccak256(abi.encodePacked(customHash,responseAddr,msg.sender));
        require(checkSign(hash,v,r,s,secretAddr));
        emit customResponse(customHash,msg.sender,responseAddr);
        
    }
    
    function phurchaseRequest(bool listing, bytes32 targetData, address owner, string memory pubKey) public payable {
        uint256 price;
        if(listing){
            price = sellDict[targetData].price;
        }
        else{
            price = customDict[targetData].price;
        }
        bytes32 txHash = keccak256(abi.encodePacked(listing,targetData,msg.sender,owner));
        //Only record one transaction
        require(txDict[txHash].targetData != targetData);
        
        require(msg.value>=price);
        TxInfo memory tmp;
        tmp.finished = false;
        tmp.listing = listing;
        tmp.price = msg.value;
        tmp.targetData = targetData;
        tmp.buyer = msg.sender;
        tmp.owner = owner;
        
        txDict[txHash] = tmp;
        
        //The owner listening to his address.
        emit txRequest(targetData,msg.sender,owner,listing,pubKey);
    }
    function isFinished(bytes32 txHash) public view returns(bool){
        return txDict[txHash].finished;
        
    }
    function phurchaseResponse(bytes32 txHash, string memory dataAddr, uint8 v, bytes32 r, bytes32 s)public{
        require(txDict[txHash].finished==false);
        bytes32 hash = keccak256(abi.encodePacked(txHash,dataAddr));
        require(checkSign(hash,v,r,s,secretAddr));
        uint256 price = txDict[txHash].price;
        msg.sender.transfer(price);
        
        //The buyer listening to txHash to get the addr.
        emit txResponse(txHash,dataAddr);
        txDict[txHash].finished = true;
    }
}