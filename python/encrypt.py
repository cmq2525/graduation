import rsa
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex
def rsa_encrypt(text,pub_key):
    #转为byte编码
    ciphertext = rsa.encrypt(text.encode(), pub_key)
    return b2a_hex(ciphertext).decode('utf-8')
def rsa_decrypt(text,pri_key):
    #转化为python使用的utf-8
    text = text.encode()
    decrypt_text = rsa.decrypt(a2b_hex(text), pri_key)
    return decrypt_text.decode('utf-8')
def add_to_16(text):
    if len(text.encode('utf-8')) % 16:
        add = 16 - (len(text.encode('utf-8')) % 16)
    else:
        add = 0
    text = text + ('\0' * add)
    return text.encode('utf-8')
# 加密函数
def aes_encrypt(text,key):
    key = add_to_16(key)
    mode = AES.MODE_ECB
    text = add_to_16(text)
    cryptos = AES.new(key, mode)
    cipher_text = cryptos.encrypt(text)
    return b2a_hex(cipher_text).decode('utf-8')
# 解密后，去掉补足的空格用strip() 去掉
def aes_decrypt(text,key):
    key = add_to_16(key)
    text = text.encode()
    mode = AES.MODE_ECB
    cryptor = AES.new(key, mode)
    plain_text = cryptor.decrypt(a2b_hex(text))
    return bytes.decode(plain_text).rstrip('\0')
