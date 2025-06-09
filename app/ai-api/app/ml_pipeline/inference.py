######################################################
# This is the inference method for the moodels. We 
# load the models and have a two tier classification. 
# First a rough classification is done into the main 
# color groups and then a second classification is done
# for the subgroups. The results are saved in a confusion
# matrix and the accuracy is printed.
######################################################
import torch
from collections import Counter
from ml_models.model_registry.CNN_LSTM import CNNLSTMModel

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MAIN_CLASSES = ['ClassA', 'Efae_Kp', 'Ssap_Eh', 'Pa_Pm_Sa', 'ClassB']
CLASSES = ['Class0', 'Efaecalis', 'Kpneumoniae', 'Ssaprophyticus', 'Ehormaechei', 'Paeruginosa', 'Pmirabilis', 'Saureus', 'Class8']

def load_ensemble_models(mode, num_folds=5, model_class=None, num_classes=5):
    """
    Load the ensemble models for a given mode and number of folds.
    """
    fold_models = []
    map_location = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    for fold in range(1, num_folds + 1):
        model = model_class(cnn_feature_size=64, hidden_size=128, num_classes=num_classes).to(map_location)
        model.load_state_dict(torch.load(f"saved_models/{mode}_fold{fold}.pth",  weights_only=True, map_location=map_location), strict=True)
        #  model.load_state_dict(torch.load(f"{mode}_vae_fold{fold}_half.pth", weights_only=True))
        model.eval()
        fold_models.append(model)
    return fold_models

def majority_vote(fold_models, images):
    """
    Perform majority voting on the predictions from the ensemble of models.
    """
    fold_predictions = []
    for model in fold_models:
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        
        # Convert predictions to integers and append to fold_predictions
        #predicted = predicted.cpu().numpy()
        #predicted = predicted.astype(int)  # Ensure predictions are integers
        
        fold_predictions.append(predicted.cpu().numpy().astype(int))

    batch_size = images.size(0)
    voted_preds = []
    for j in range(batch_size):
        sample_preds = [fold_predictions[f][j] for f in range(len(fold_models))]
        most_common = Counter(sample_preds).most_common(1)[0][0]
        voted_preds.append(most_common)
    return voted_preds

    
def predict(images: torch.Tensor, use_two_stage: bool = True):
    """
    Predicts using either only the first-tier or both tiers of the classification model.
    
    Args:
        images (torch.Tensor): A batch of images for classification.
        use_two_stage (bool): If True, perform both first-tier and second-tier classification. 
                              If False, return only first-tier predictions.
                              
    Returns:
        dict: Dictionary containing predictions from the first tier, and optionally from the second tier.
    """
    # Load First-tier models
    first_models = load_ensemble_models(mode='first_classification', num_folds=5, model_class=CNNLSTMModel, num_classes=5)
    first_preds = majority_vote(first_models, images)
    
    # convert 

    if not use_two_stage:
        return {
            "first_tier_preds": first_preds,
            "second_tier_preds": None
        }

    # Load Second-tier models
    ef_kp_models = load_ensemble_models('ef_kp', num_folds=5, model_class=CNNLSTMModel, num_classes=2)
    eh_ss_models = load_ensemble_models('eh_ss', num_folds=5, model_class=CNNLSTMModel, num_classes=2)
    pa_pm_sa_models = load_ensemble_models('pa_pm_sa', num_folds=5, model_class=CNNLSTMModel, num_classes=3)

    second_preds = []
    
    for i, first_pred in enumerate(first_preds):
        img = images[i].unsqueeze(0).to(device)

        if first_pred == 1:   # efaecalis/kpneumoniea
            second = majority_vote(ef_kp_models, img)[0] + 1
        elif first_pred == 2: # ssaprophyticus/ehormaechei
            second = majority_vote(eh_ss_models, img)[0] + 3
        elif first_pred == 3: # paeruginosa/pmirabilis/saureus
            second = majority_vote(pa_pm_sa_models, img)[0] + 5
        elif first_pred == 0:
            second = 0        # sterile
        elif first_pred == 4:
            second = 8        # Ecoli
        else:
            raise ValueError("Invalid first-tier prediction")

        second_preds.append(second)
        
    final_label_map = {
        0: 'Sterile',
        1: 'Efaecalis',
        2: 'Kpneumoniae',
        3: 'Ssaprophyticus',
        4: 'Ehormaechei',
        5: 'Paeruginosa',
        6: 'Pmirabilis',
        7: 'Saureus',
        8: 'Ecoli'
    }
    
    first_label_map = {
        0: 'Sterile',
        1: 'Efaecalis/Kpneumoniae',
        2: 'Ssaprophyticus/Ehormaechei',
        3: 'Paeruginosa/Pmirabilis/Saureus',
        4: 'Ecoli'
    }
    
    return {
        "first_tier_preds": first_preds,
        "second_tier_preds": second_preds,
        "first_tier_labels": [first_label_map[pred] for pred in first_preds],
        "final_preds": [final_label_map[pred] for pred in second_preds]   
    }






