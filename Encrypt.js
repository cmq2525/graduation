const NodeRSA = require('node-rsa');

function generateRSAKey() {
    var keyObj = new NodeRSA({ b: 1024 });
    var pubKey = keyObj.exportKey('public');
    var priKey = keyObj.exportKey('private');
    return { pubKey: pubKey, priKey: priKey };
}
function RSAEncrypt(pubKey, text) {
    var keyObj = new NodeRSA(pubKey);
    var cipher = keyObj.encrypt(text, 'base64');
    return cipher;
}
function RSADecrypt(priKey, cipher) {
    var keyObj = new NodeRSA(priKey);
    var text = keyObj.decrypt(cipher, 'utf8');
    return text;
}
module.exports = {
    generateRSAKey, RSAEncrypt, RSADecrypt
}