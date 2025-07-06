import torch
import torch.nn as nn

################################################
# This is the model architecture. It consists of 
# a CNN for feature extraction of the single imgs
# and an LSTM for sequence classification.
################################################

class CNNExtractor(nn.Module):
    def __init__(self):
        super(CNNExtractor, self).__init__()

        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        
        self.conv3 = nn.Conv2d(64, 64, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(64)
        
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1)
        self.bn4 = nn.BatchNorm2d(256)

        self.conv5 = nn.Conv2d(256, 256, kernel_size=3, stride=1, padding=1)
        self.bn5 = nn.BatchNorm2d(256)
        
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2) 
        self.global_avg_pool = nn.AdaptiveAvgPool2d(1) 
        self.dropout = nn.Dropout(0.3)
        
    def forward(self, x):
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.pool(x)
        x = self.dropout(x)
        x = self.relu(self.bn2(self.conv2(x)))
        x = self.pool(x)
        x = self.dropout(x)
        x = self.relu(self.bn3(self.conv3(x)))
        x = self.global_avg_pool(x)
        x = x.view(x.size(0), -1)
        return x

class CNNLSTMModel(nn.Module):
    def __init__(self, cnn_feature_size=64, hidden_size=128, num_classes=5):
        super(CNNLSTMModel, self).__init__()
        self.cnn_extractor = CNNExtractor()
        
        self.lstm = nn.LSTM(input_size=cnn_feature_size, hidden_size=hidden_size, num_layers=1, batch_first=True, dropout=0.5)
        
        self.fc = nn.Linear(hidden_size, num_classes)
        self.dropout = nn.Dropout(0.5) 

    def forward(self, x):
        batch_size, sequence_length, C, H, W = x.size()
        cnn_features = []

        for t in range(sequence_length):
            cnn_out = self.cnn_extractor(x[:, t, :, :, :])
            cnn_features.append(cnn_out)

        cnn_features = torch.stack(cnn_features, dim=1)  
        lstm_out, _ = self.lstm(cnn_features)  
        lstm_out = self.dropout(lstm_out[:, -1, :]) 
        out = self.fc(lstm_out)
        return out
