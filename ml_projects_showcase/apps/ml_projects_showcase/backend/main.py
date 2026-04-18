import os
import joblib
import pandas as pd
import numpy as np

# Constants
BASE_PATH = "apps/ml_projects_showcase/backend"
DATA_PATH = os.path.join(BASE_PATH, "data")
MODELS_PATH = os.path.join(BASE_PATH, "models")

# Feature Metadata
OBESITY_FEATURES = [
    {"id": "Gender", "name": "Gender", "type": "categorical", "options": ["Female", "Male"]},
    {"id": "Age", "name": "Age", "type": "number", "min": 1, "max": 100},
    {"id": "Height", "name": "Height (m)", "type": "number", "min": 1.0, "max": 2.5},
    {"id": "Weight", "name": "Weight (kg)", "type": "number", "min": 30, "max": 200},
    {"id": "family_history_with_overweight", "name": "Family History Overweight", "type": "categorical", "options": ["yes", "no"]},
    {"id": "FAVC", "name": "Frequent high calorie food", "type": "categorical", "options": ["yes", "no"]},
    {"id": "FCVC", "name": "Frequency of vegetables", "type": "number", "min": 1, "max": 3},
    {"id": "NCP", "name": "Number of main meals", "type": "number", "min": 1, "max": 4},
    {"id": "CAEC", "name": "Food between meals", "type": "categorical", "options": ["no", "Sometimes", "Frequently", "Always"]},
    {"id": "SMOKE", "name": "Smoking habit", "type": "categorical", "options": ["yes", "no"]},
    {"id": "CH2O", "name": "Water intake daily", "type": "number", "min": 1, "max": 3},
    {"id": "SCC", "name": "Calories monitoring", "type": "categorical", "options": ["yes", "no"]},
    {"id": "FAF", "name": "Physical activity frequency", "type": "number", "min": 0, "max": 3},
    {"id": "TUE", "name": "Time using technology", "type": "number", "min": 0, "max": 2},
    {"id": "CALC", "name": "Alcohol consumption", "type": "categorical", "options": ["no", "Sometimes", "Frequently", "Always"]},
    {"id": "MTRANS", "name": "Transportation", "type": "categorical", "options": ["Public_Transportation", "Walking", "Automobile", "Motorbike", "Bike"]}
]

BREAST_CANCER_FEATURES = [
    {"id": "Radius_Mean", "name": "Radius Mean", "type": "number"},
    {"id": "Texture_Mean", "name": "Texture Mean", "type": "number"},
    {"id": "Perimeter_Mean", "name": "Perimeter Mean", "type": "number"},
    {"id": "Area_Mean", "name": "Area Mean", "type": "number"},
    {"id": "Smoothness_Mean", "name": "Smoothness Mean", "type": "number"},
    {"id": "Compactness_Mean", "name": "Compactness Mean", "type": "number"},
    {"id": "Concavity_Mean", "name": "Concavity Mean", "type": "number"},
    {"id": "Concave_Points_Mean", "name": "Concave Points Mean", "type": "number"},
    {"id": "Symmetry_Mean", "name": "Symmetry Mean", "type": "number"},
    {"id": "Radius_Se", "name": "Radius SE", "type": "number"},
    {"id": "Perimeter_Se", "name": "Perimeter SE", "type": "number"},
    {"id": "Area_Se", "name": "Area SE", "type": "number"},
    {"id": "Compactness_Se", "name": "Compactness SE", "type": "number"},
    {"id": "Concavity_Se", "name": "Concavity SE", "type": "number"},
    {"id": "Concave_Points_Se", "name": "Concave Points SE", "type": "number"},
    {"id": "Fractal_Dimension_Se", "name": "Fractal Dimension SE", "type": "number"},
    {"id": "Radius_Worst", "name": "Radius Worst", "type": "number"},
    {"id": "Texture_Worst", "name": "Texture Worst", "type": "number"},
    {"id": "Perimeter_Worst", "name": "Perimeter Worst", "type": "number"},
    {"id": "Area_Worst", "name": "Area Worst", "type": "number"},
    {"id": "Smoothness_Worst", "name": "Smoothness Worst", "type": "number"},
    {"id": "Compactness_Worst", "name": "Compactness Worst", "type": "number"},
    {"id": "Concavity_Worst", "name": "Concavity Worst", "type": "number"},
    {"id": "Concave_Points_Worst", "name": "Concave Points Worst", "type": "number"},
    {"id": "Symmetry_Worst", "name": "Symmetry Worst", "type": "number"},
    {"id": "Fractal_Dimension_Worst", "name": "Fractal Dimension Worst", "type": "number"}
]

# Cache for models
_models = {}

def _load_model(name):
    if name not in _models:
        path = os.path.join(MODELS_PATH, f"{name}_model.joblib")
        print(f"[BACKEND_STEP] Loading model from {path}")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found: {path}")
        _models[name] = joblib.load(path)
    return _models[name]

def get_projects():
    """Return metadata about available ML projects."""
    print("[BACKEND_START] get_projects")
    projects = [
        {
            "id": "obesity",
            "name": "Obesity Level Prediction",
            "description": "Predicts obesity levels based on eating habits and physical condition using a Random Forest Classifier.",
            "features": OBESITY_FEATURES
        },
        {
            "id": "breast_cancer",
            "name": "Breast Cancer Classification",
            "description": "Classifies tumors as Malignant or Benign based on digitized images of fine needle aspirate (FNA) using Logistic Regression.",
            "features": BREAST_CANCER_FEATURES
        }
    ]
    print(f"[BACKEND_SUCCESS] Returning {len(projects)} projects")
    return projects

def predict_obesity(features: dict):
    """Predict obesity level using the trained RandomForest model."""
    print(f"[BACKEND_START] predict_obesity with {len(features)} features")
    try:
        model = _load_model("obesity")
        
        # Convert dict to DataFrame for pipeline
        df = pd.DataFrame([features])
        
        # Ensure all expected columns are present (even if empty/null)
        # Numerical and Categorical feature lists from train_models.py
        all_cols = ['Gender', 'Age', 'Height', 'Weight', 'family_history_with_overweight', 
                    'FAVC', 'FCVC', 'NCP', 'CAEC', 'SMOKE', 'CH2O', 'SCC', 'FAF', 'TUE', 'CALC', 'MTRANS']
        
        for col in all_cols:
            if col not in df.columns:
                df[col] = np.nan
        
        # Standardize types
        df['Age'] = pd.to_numeric(df['Age'], errors='coerce')
        df['Height'] = pd.to_numeric(df['Height'], errors='coerce')
        df['Weight'] = pd.to_numeric(df['Weight'], errors='coerce')
        
        prediction = model.predict(df)[0]
        probs = model.predict_proba(df)[0]
        classes = model.classes_
        
        prob_dict = {cls: float(prob) for cls, prob in zip(classes, probs)}
        
        result = {
            "prediction": str(prediction),
            "probability": prob_dict
        }
        print(f"[BACKEND_SUCCESS] Prediction: {prediction}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] predict_obesity failed: {str(e)}")
        raise

def predict_breast_cancer(features: dict):
    """Predict breast cancer diagnosis using the trained Logistic Regression model."""
    print(f"[BACKEND_START] predict_breast_cancer with {len(features)} features")
    try:
        model = _load_model("breast_cancer")
        
        # Ensure correct feature order as expected by the model
        expected_features = model.feature_names_in_
        
        # Create a dict with all expected features, defaulting to 0 or NaN
        # Better to default to 0 for these numerical medical measurements if missing
        ordered_features = {}
        for feat in expected_features:
            ordered_features[feat] = float(features.get(feat, 0))
            
        df = pd.DataFrame([ordered_features])
        # Force order again just in case
        df = df[expected_features]
        
        prediction_val = model.predict(df)[0]
        probs = model.predict_proba(df)[0]
        classes = model.classes_ # 0 (B), 1 (M)
        
        # Map classes back to B/M
        class_map = {0: "B", 1: "M"}
        prediction = class_map.get(prediction_val, str(prediction_val))
        prob_dict = {class_map.get(cls, str(cls)): float(prob) for cls, prob in zip(classes, probs)}
        
        result = {
            "prediction": prediction,
            "probability": prob_dict
        }
        print(f"[BACKEND_SUCCESS] Prediction: {prediction}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] predict_breast_cancer failed: {str(e)}")
        raise

def get_data_sample(project_id: str, n: int = 5):
    """Return a small sample of the raw dataset for the project."""
    print(f"[BACKEND_START] get_data_sample for {project_id}, n={n}")
    try:
        file_map = {
            "obesity": "obesity.csv",
            "breast_cancer": "breast_cancer.csv"
        }
        
        filename = file_map.get(project_id)
        if not filename:
            raise ValueError(f"Unknown project ID: {project_id}")
            
        path = os.path.join(DATA_PATH, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Dataset file not found: {path}")
            
        df = pd.read_csv(path)
        sample = df.sample(min(n, len(df))).to_dict(orient="records")
        
        print(f"[BACKEND_SUCCESS] Returning {len(sample)} rows")
        return sample
    except Exception as e:
        print(f"[BACKEND_ERROR] get_data_sample failed: {str(e)}")
        raise

__all__ = ["get_projects", "predict_obesity", "predict_breast_cancer", "get_data_sample"]
