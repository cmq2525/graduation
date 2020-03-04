from utils import *
from encrypt import *

from flask import Flask,request
import os
import subprocess

def get_server():
    app = Flask(__name__,
            static_folder = "./dist/static",
            template_folder = "./dist")

    #存储出售数据集的地址，索引是智能合约中，数据集的hash，value是用AES加密后的ipfs地址
    AES_KEY = "YIGEMIYAO"
    subprocess.getoutput(['touch sell_dict.pkl'])
    subprocess.getoutput(['touch prikey_dict.pkl'])

    sell_dict = load_model('sell_dict.pkl')
    prikey_dict = load_model('prikey_dict.pkl')

    @app.route("/api/train_and_upload",methods=['GET',])
    def train_and_upload():
        #获取到传入url中参数id对应的值
        data_name = request.args.get('data')
        clf = train_model(data_name)
        model_name = data_name.split('.')[0]+'.pkl'
        save_model(clf,model_name)
        model_addr = upload_file(model_name)
        data_addr = upload_file(data_name)

        #由于还不知道dataset_hash是什么，暂时先以model_addr作为key，将data_addr的密文存到sell_dict中
        sell_dict[model_addr] = aes_encrypt(data_addr,AES_KEY)
        return model_addr
    #使用web3js计算出数据集的hash，更新数据集字典（之前是以model_addr为key，现在将key换为data_hash）
    @app.route("/api/update_hash",methods=['GET',])
    def update_hash():
        old_key = request.args.get('model_addr')
        new_key = request.args.get('dataset_hash')
        sell_dict[new_key] = sell_dict[old_key]
        sell_dict.pop(old_key)
        return 'success'
    @app.route("/api/send_dataset",methods=['GET',])
    def send_dataset():
        pub_key,pri_key = rsa.newkeys(256)
        pub_key.n = int(request.args.get('pub_key'))
        dataset_hash = request.args.get('dataset_hash')
        #这里ipfs地址是长度为46的字符串，而python的rsa库只能加密21字节的信息
        #因此需要分别加密
        data_addr = aes_decrypt(sell_dict[dataset_hash],AES_KEY)
        msg1 = data_addr[:6]
        msg2 = data_addr[6:26]
        msg3 = data_addr[26:]
        cipher1 = rsa_encrypt(msg1,pub_key)
        cipher2 = rsa_encrypt(msg2,pub_key)
        cipher3 = rsa_encrypt(msg3,pub_key)
        return '+'.join([cipher1,cipher2,cipher3])
    #准备购买数据集，产生用于加密的密钥对，将私钥储存
    @app.route("/api/prepare_to_buy")
    def prepare_to_buy():
        target_dataset = request.args.get("dataset_hash")
        pub_key,pri_key = rsa.newkeys(256)
        prikey_dict[target_dataset] = pri_key
        return str(pub_key.n)
    @app.route('/api/decrypt_addr')
    def decrypt_addr():
        dataset_hash = request.args.get('dataset_hash')
        cipher = request.args.get('cipher')
        pri_key = prikey_dict[dataset_hash]
        cipher_list = cipher.split(' ')
        data_addr = ''
        print(cipher_list)
        for cp in cipher_list:
            print(cp)
            data_addr += rsa_decrypt(cp,pri_key)
        return data_addr

    @app.route('/api/train_my_model')
    def train_my_model():
        #获取到传入url中参数id对应的值
        data_name = request.args.get('data')
        clf = train_model(train_file)
        model_name = train_file.split('.')[0]+'.pkl'
        save_model(clf,model_name)
        model_addr = upload_file(model_name)
        return model_addr
    @app.route('/api/test_dataset')
    def test_dataset():
        data_name = request.args.get('data')
        model_addr = request.args.get('model_addr')
        download_file(model_addr)
        clf = load_model(model_addr)
        result = test_model(data_name,clf)
        output = os.popen('rm ' + model_addr)
        return result

    @app.route('/')
    def index():
        return 'hello'
    # def index():
    #     return render_template("index.html")
    return app