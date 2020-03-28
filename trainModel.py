from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from numpy import loadtxt
import pickle
import os

import subprocess
import threading
from flask import Flask, request,make_response, jsonify

def train_model(file_name):
    dataset = loadtxt(file_name,dtype='str',delimiter=',')
    train_data, train_label = dataset[1:,:-1], dataset[1:,-1]
    clf = RandomForestClassifier()
    clf.fit(train_data,train_label)
    return clf
def test_model(file_name,clf):
    dataset = loadtxt(file_name,dtype='str',delimiter=',')
    test_data,test_label = dataset[1:,:-1],dataset[1:,-1]
    pred = clf.predict(test_data)
    return classification_report(test_label,pred)
def save_model(clf,file_name='model.pkl'):
    with open(file_name,'wb') as pkl_file:
        pickle.dump(clf,pkl_file)
        
def load_model(file_name='model.pkl'):
    try:
        with open(file_name,'rb') as pkl_file:
            clf = pickle.load(pkl_file)
        return clf
    except EOFError:
        return {}
def upload_file(file_name):
    output = subprocess.getoutput(['ipfs add ' + file_name])
    #print(output.split())
    addr = output.split()[-8]
    #上传过程中可能会出现进度条，这样倒数第八个对应的信息就是文件名，倒数第九个是ipfs地址
    if('.' in addr):
        addr = output.split()[-9]
    
    print('upload successful at: ',addr)
    return addr
def download_file(addr):
    subprocess.getoutput(['ipfs get ' + addr])
def get_server():
    app = Flask(__name__)
    model_dict = {}

    @app.route("/api/train_and_upload",methods=['GET',])
    def train_and_upload():
        #获取到传入url中参数id对应的值
        data_name = request.args.get('data')
        data_addr = upload_file(data_name)
        if(data_addr in model_dict):
            return jsonify({})
        clf = train_model(data_name)
        model_name = data_name.split('.')[0]+'.pkl'
        save_model(clf,model_name)
    #         model_addr = 'QmUDkGnKMwdMMvTowBwUqmLV1sv6SdprK7WhvJfwFHjdzL'
    #         data_addr = 'QmZiiuXwHfszjy1Spj8UuzGwdQ14ozicEj526ud45agMGA'
        model_addr = upload_file(model_name)
        data_addr = upload_file(data_name)
        model_dict[data_addr] = model_addr
        return jsonify({'modelAddr':model_addr,'dataAddr':data_addr})

    @app.route('/api/test_and_upload')
    def test_and_upload():
        data_name = request.args.get('data')
        data_addr = upload_file(data_name)
        model_addr = request.args.get('modelAddr')
        download_file(model_addr)
        clf = load_model(model_addr)
        test_result = test_model(data_name,clf)
        output = os.popen('rm ' + model_addr)
        return jsonify({'testResult':test_result,'dataAddr':data_addr})
    @app.route('/')
    def hello():
        return 'hello'
    return app

if __name__ == '__main__':
    app = get_server()
    app.run('0.0.0.0',9999)