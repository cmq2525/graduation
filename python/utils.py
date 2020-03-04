from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import pandas as pd
import numpy as np
import pickle
import os
def train_model(file_name):
    dataset = pd.read_csv(file_name)
    train_data, train_label = dataset.values[:,:-1], dataset.values[:,-1]
    clf = RandomForestClassifier()
    clf.fit(train_data,train_label)
    return clf
def test_model(file_name,clf):
    dataset = pd.read_csv(file_name)
    test_data,test_label = dataset.values[:,:-1],dataset.values[:,-1]
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
    output = os.popen('ipfs add ' + file_name)
    addr = output.read().split(' ')[1]
    return addr
def download_file(addr):
    output = os.popen('ipfs get ' + addr)