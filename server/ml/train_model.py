import pandas as pd
import os
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
import pickle

class HeartDiseaseEnsemblePredictor:
    def __init__(self):
        self.models = {
            'Logistic Regression': LogisticRegression(),
            'Naive Bayes': GaussianNB(),
            'Random Forest': RandomForestClassifier(n_estimators=20, random_state=12, max_depth=5),
            'XGBoost': XGBClassifier(learning_rate=0.01, n_estimators=25, max_depth=15,
                                   gamma=0.6, subsample=0.52, colsample_bytree=0.6,
                                   seed=27, reg_lambda=2, booster='dart',
                                   colsample_bylevel=0.6, colsample_bynode=0.5),
            'KNN': KNeighborsClassifier(n_neighbors=10),
            'Decision Tree': DecisionTreeClassifier(criterion='entropy', random_state=0, max_depth=6)
        }
        self.scaler = StandardScaler()
        self.feature_names = None
        
    def train(self, data_path):
        """Train all models"""
        print(f"Loading data from: {data_path}")
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Dataset not found at {data_path}")
            
        # Load data
        data = pd.read_csv(data_path)
        print(f"Dataset loaded successfully. Shape: {data.shape}")
        print("\nFirst few rows of the dataset:")
        print(data.head())
        print("\nColumns in the dataset:")
        print(data.columns.tolist())
        
        y = data["HeartDisease"]
        X = data.drop('HeartDisease', axis=1)
        
        # Store original feature names
        self.feature_names = X.columns.tolist()
        print(f"\nFeatures being used: {self.feature_names}")
        
        # Convert categorical variables
        X = pd.get_dummies(X, drop_first=True)
        self.encoded_feature_names = X.columns.tolist()
        
        # Split and scale data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print(f"\nTraining set shape: {X_train.shape}")
        print(f"Test set shape: {X_test.shape}")
        
        # Train all models
        print("\nTraining models...")
        self.model_performance = {}
        for name, model in self.models.items():
            print(f"\nTraining {name}...")
            model.fit(X_train_scaled, y_train)
            train_score = model.score(X_train_scaled, y_train)
            test_score = model.score(X_test_scaled, y_test)
            self.model_performance[name] = {
                'train_score': train_score,
                'test_score': test_score
            }
            print(f"{name} - Train Score: {train_score:.4f}, Test Score: {test_score:.4f}")

    def save_models(self, save_path):
        """Save all models and components"""
        print(f"\nSaving models to: {save_path}")
        save_dict = {
            'models': self.models,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'encoded_feature_names': self.encoded_feature_names,
            'model_performance': self.model_performance
        }
        with open(save_path, 'wb') as f:
            pickle.dump(save_dict, f)
        print("Models saved successfully!")

if __name__ == "__main__":
    try:
        # Define paths
        current_dir = os.path.dirname(os.path.abspath(__file__))
        DATA_PATH = os.path.join(current_dir, "heart.csv")
        MODEL_SAVE_PATH = os.path.join(current_dir, "heart_disease_ensemble.pkl")
        
        print("Starting model training process...")
        print(f"Current directory: {current_dir}")
        
        # Initialize and train
        predictor = HeartDiseaseEnsemblePredictor()
        predictor.train(DATA_PATH)
        
        # Save the trained model
        predictor.save_models(MODEL_SAVE_PATH)
        
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        print("\nPlease ensure:")
        print("1. The heart.csv file is in the same directory as this script")
        print("2. The file contains the expected columns")
        print("3. You have sufficient permissions to read/write in this directory")