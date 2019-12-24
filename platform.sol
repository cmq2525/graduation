pragma solidity >=0.4.22 <0.6.0;

contract PlatForm{
    //These two address is generated as the contract buit.
    //The address and the corresponding private_key is hard-coded in the source code of the software.
    address public seller_pub_address;

    event phurchaseRequest(address indexed seller,bytes32 dataTxHash);
    event phurchaseResponse(bytes32 indexed dataTxHash, bytes32 datasetHash, string encodedAddr);
    //Record how much the dataset sold
    event recordMoney(bytes32 datasetHash, uint256 money);

    struct DataInfo{
        bool onSale;             //Is this dataset on sale?
        uint256 numSales;        //How many times this dataset has been saled.
        address owner;           //The owner of the dataset.

        string dataName;         //The name of the dataset.
        string dataInfo;         //The descrption of the dataset, number of columns and the column name must be included.
        string modelAddr;       //The ipfs address of the1 validation model.
        uint256 sellPrice;       //How much it cost to validate the dataset.

    }
    struct TxInfo{
        bool finished;
        uint256 money;       //(wei)
        bytes32 datasetHash; //The hash of the target dataset
        address sender;      //The one who send the message can get back the money as his wish.
        address receiver;    //The one who should receiver the money can get the money after the due action. (Thus we need to check the sig)

        string pubKey;       //The public key used to encrypt the dataset's address.
        //string cipherAddr    //The ciphertext of the dataset address, which can be decrpted by the user's priKey.
    }

    //use the hash of DataInfo to retrieve from the dict;
    mapping(bytes32=>DataInfo) public sell_dict;
    bytes32[] public sell_list;

    //use the hash of TxInfo to search from the dict;

    mapping(bytes32=>TxInfo) public phurchase_dict;


    constructor(address sp) public {
        seller_pub_address = sp;
    }

    //get the list's length, and then traversal the list, or traversal the newly-inserted list;
    function getListLength()public view returns(uint){
        return sell_list.length;
    }

    function check_sig(bytes32 h, uint8  v, bytes32  r, bytes32  s, address target_addr) public pure returns (bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, h));
        address addr = ecrecover(prefixedHash, v, r, s);
        return (addr == target_addr);
    }

    //regeister the infomation of dataset
    function register(string memory dataName,string memory dataInfo, string memory modelAddr, uint256 sellPrice, uint8 v, bytes32 r, bytes32 s) public {
       //Check if the model is train and upload automatically by the software.

       require(check_sig(keccak256(abi.encodePacked(modelAddr)),v,r,s,seller_pub_address));

       bytes32 hash = keccak256(abi.encodePacked(msg.sender,dataName,dataInfo,modelAddr,sellPrice));

       //judge if it is on sale;
       if(sell_dict[hash].owner==address(0))
       {
           DataInfo memory tmp;

           tmp.onSale = true;
           tmp.numSales = 0;
           tmp.owner = msg.sender;

           tmp.dataName = dataName;
           tmp.dataInfo = dataInfo;
           tmp.modelAddr = modelAddr;
           tmp.sellPrice = sellPrice;

           sell_dict[hash] = tmp;
           sell_list.push(hash);

       }
       else if(sell_dict[hash].onSale=false)
       {
           sell_dict[hash].onSale = true;
       }
    }

    function addSales(bytes32 hash) public{
        sell_dict[hash].numSales += 1;
    }
    //The buyer send a validation request
    function sendPhurchaseMoney(bytes32 datasetHash, address sender, address receiver, string memory pubKey) public payable{
        bytes32 dataTxHash = keccak256(abi.encodePacked(datasetHash,sender,receiver));
        uint256 money = msg.value;
        if (phurchase_dict[dataTxHash].sender == address(0))
        {
            require(money > sell_dict[datasetHash].sellPrice);

            TxInfo memory tmp;
            tmp.finished = false;

            tmp.money = money;
            tmp.datasetHash = datasetHash;
            tmp.sender = sender;
            tmp.receiver = receiver;
            //The pubKey which seller used to encrypt the datasetAddr
            tmp.pubKey = pubKey;

            phurchase_dict[dataTxHash] = tmp;
            addSales(datasetHash);

            emit phurchaseRequest(receiver,dataTxHash);
        }
        else
        {
            phurchase_dict[dataTxHash].money += money;
        }
    }
    function verifyPhurchase(bytes32 dataTxHash) public  {
        require(phurchase_dict[dataTxHash].sender == msg.sender);
        require(phurchase_dict[dataTxHash].finished == false);
        phurchase_dict[dataTxHash].finished = true;
        //transfer type 'address' to type 'address payable'
        address(uint160(phurchase_dict[dataTxHash].receiver)).transfer(phurchase_dict[dataTxHash].money);
        emit recordMoney(phurchase_dict[dataTxHash].datasetHash,phurchase_dict[dataTxHash].money);
    }

    function uploadDataset(bytes32 dataTxHash, string memory encodedAddr, uint8 v, bytes32 r, bytes32 s) public{
        require(phurchase_dict[dataTxHash].receiver == msg.sender);
        bytes32 hash = keccak256(abi.encodePacked(dataTxHash,encodedAddr));
        require(check_sig(hash,v,r,s,seller_pub_address));

        emit phurchaseResponse(dataTxHash, phurchase_dict[dataTxHash].datasetHash, encodedAddr);
    }
    // function receivePhurchaseMoney(bytes32 dataTxHash,uint8 v, bytes32 r, bytes32 s) public{
    //     require(phurchase_dict[dataTxHash].receiver == msg.sender);
    //     require(phurchase_dict[dataTxHash].finished == false);
    //     require(phurchase_dict[dataTxHash].received == true);
    //     msg.sender.transfer(phurchase_dict[dataTxHash].money);
    //     phurchase_dict[dataTxHash].finished = true;
    // }

    // function receivePhurchaseMoney(bytes32 dataTxHash, string memory encodedAddr, uint8 v, bytes32 r, bytes32 s) public{
    //     //Only the receiver can call this function

    //     require(phurchase_dict[dataTxHash].receiver == msg.sender);
    //     require(phurchase_dict[dataTxHash].finished == false);
    //     require(phurchase_dict[dataTxHash].received == true);

    //     bytes32 hash = keccak256(abi.encodePacked(dataTxHash,encodedAddr));
    //     require(check_sig(hash,v,r,s,seller_pub_address));

    //     msg.sender.transfer(phurchase_dict[dataTxHash].money);
    //     //only transfer once
    //     phurchase_dict[dataTxHash].finished = true;

    //     emit phurchaseResponse(dataTxHash,encodedAddr);
    // }

    //The seller retrieves the sale.
    function retrieveSale(bytes32 datasetHash) public{
        require(msg.sender==sell_dict[datasetHash].owner);
        sell_dict[datasetHash].onSale = false;
    }

    //The buyer retrieve the phurchase money before the transaction finished;
    function retrievePhurchase(bytes32 dataTxHash) public {
        require(phurchase_dict[dataTxHash].finished == false && msg.sender==phurchase_dict[dataTxHash].sender);
        phurchase_dict[dataTxHash].finished = true;
        msg.sender.transfer(phurchase_dict[dataTxHash].money);
    }

}
