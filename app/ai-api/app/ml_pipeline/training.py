import torch
import torch.nn as nn
import torch.optim as optim
from tqdm import tqdm
from sklearn.metrics import confusion_matrix, classification_report, f1_score
import seaborn as sns
import matplotlib.pyplot as plt



# --- Training Function ---

def train_concentration_model(model, train_loader, val_loader, epochs=10, lr=1e-4, device='cuda', class_weights=None):
    model = model.to(device)

    criterion = nn.CrossEntropyLoss(weight=class_weights.to(device) if class_weights is not None else None)
    optimizer = optim.Adam(model.parameters(), lr=lr)

    for epoch in range(epochs):
        # ---- TRAINING ----
        model.train()
        train_loss, train_correct, train_total = 0, 0, 0
        train_preds, train_labels = [], []

        for _, x, y in tqdm(train_loader, desc=f"Epoch {epoch+1} - Train"):
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            output = model(x)
            loss = criterion(output, y)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * x.size(0)
            preds = output.argmax(dim=1)
            train_correct += (preds == y).sum().item()
            train_total += y.size(0)

            train_preds.extend(preds.cpu().numpy())
            train_labels.extend(y.cpu().numpy())

        print("\nTrain Classification Report:")
        print(classification_report(train_labels, train_preds))

        # ---- VALIDATION ----
        model.eval()
        val_loss, val_correct, val_total = 0, 0, 0
        val_preds, val_labels = [], []

        with torch.no_grad():
            for _, x, y in tqdm(val_loader, desc=f"Epoch {epoch+1} - Val"):
                x, y = x.to(device), y.to(device)
                output = model(x)
                loss = criterion(output, y)

                val_loss += loss.item() * x.size(0)
                preds = output.argmax(dim=1)
                val_correct += (preds == y).sum().item()
                val_total += y.size(0)

                val_preds.extend(preds.cpu().numpy())
                val_labels.extend(y.cpu().numpy())

        f1 = f1_score(val_labels, val_preds, average='macro')
        print(f"\n[Epoch {epoch+1}] "
              f"Train Loss: {train_loss/train_total:.4f}, Train Acc: {train_correct/train_total:.4f} | "
              f"Val Loss: {val_loss/val_total:.4f}, Val Acc: {val_correct/val_total:.4f}, Val Macro F1: {f1:.4f}")

        # --- Confusion Matrix ---
        cm = confusion_matrix(val_labels, val_preds)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.xlabel("Predicted")
        plt.ylabel("True")
        plt.title(f"Confusion Matrix (Epoch {epoch+1})")
        plt.show()

        print("Validation Classification Report:")
        print(classification_report(val_labels, val_preds))

    # --- Save Final Model ---
    torch.save(model.state_dict(), 'concentration_classifier_final.pth')
    print("Model saved to concentration_classifier_final.pth")

    return model