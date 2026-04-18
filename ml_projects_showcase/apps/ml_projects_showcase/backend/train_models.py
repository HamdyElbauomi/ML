import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import joblib
import os

def build_obesity_model():
    print("[BACKEND] Building Obesity Model")
    data_path = 'apps/ml_projects_showcase/backend/data/obesity.csv'
    df = pd.read_csv(data_path)
    
    # NObeyesdad is the target in the downloaded CSV
    target = 'NObeyesdad'
    X = df.drop(target, axis=1)
    y = df[target]
    
    categorical_features = ['Gender', 'family_history_with_overweight', 'FAVC', 'CAEC', 'SMOKE', 'SCC', 'CALC', 'MTRANS']
    numerical_features = ['Age', 'Height', 'Weight', 'FCVC', 'NCP', 'CH2O', 'FAF', 'TUE']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    
    os.makedirs('apps/ml_projects_showcase/backend/models', exist_ok=True)
    joblib.dump(model, 'apps/ml_projects_showcase/backend/models/obesity_model.joblib')
    print("[BACKEND] Obesity Model saved")

def build_breast_cancer_model():
    print("[BACKEND] Building Breast Cancer Model")
    data_path = 'apps/ml_projects_showcase/backend/data/breast_cancer.csv'
    df = pd.read_csv(data_path)
    
    if 'ID' in df.columns:
        df.drop('ID', axis=1, inplace=True)
        
    df['Diagnosis'] = df['Diagnosis'].map({'M': 1, 'B': 0})
    
    X = df.drop('Diagnosis', axis=1)
    y = df['Diagnosis']
    
    # Simple feature selection based on notebook's drop list
    column_drop = ['Smoothness_Se', 'Texture_Se', 'Symmetry_Se', 'Fractal_Dimension_Mean']
    X = X.drop(columns=[c for c in column_drop if c in X.columns])
    
    model = Pipeline(steps=[
        ('scaler', StandardScaler()),
        ('classifier', LogisticRegression(max_iter=1000))
    ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    
    os.makedirs('apps/ml_projects_showcase/backend/models', exist_ok=True)
    joblib.dump(model, 'apps/ml_projects_showcase/backend/models/breast_cancer_model.joblib')
    print("[BACKEND] Breast Cancer Model saved")

if __name__ == "__main__":
    build_obesity_model()
    build_breast_cancer_model()
