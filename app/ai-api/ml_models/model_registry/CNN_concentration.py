import torch
import torch.nn as nn
import torchvision.models as models
from collections import Counter
# --- Model Definition ---
class ConcentrationClassifier(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()
        base = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
        self.backbone = base.features  # Pretrained EfficientNet feature extractor
        self.pooling = nn.AdaptiveAvgPool2d(1)  # Global average pooling
        self.classifier = nn.Linear(base.classifier[1].in_features, num_classes)

    def forward(self, x):
        x = self.backbone(x)            # (B, C, H, W)
        x = self.pooling(x)             # (B, C, 1, 1)
        x = x.view(x.size(0), -1)       # (B, C)
        x = self.classifier(x)          # (B, num_classes)
        return x

# --- Class Weights ---

def compute_class_weights(dataset, num_classes):
    labels = [y for _, _, y, _ in dataset]
    counts = Counter(labels)
    total = sum(counts.values())
    weights = [total / (num_classes * counts[i]) for i in range(num_classes)]
    return torch.tensor(weights, dtype=torch.float)

