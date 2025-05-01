import pandas as pd
import os
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
import pickle

class GastricCancerEnsemblePredictor:
    def __init__(self):
        self.models = {
            'Logistic Regression': LogisticRegression(max_iter=1000),
            'Naive Bayes': GaussianNB(),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10),
            'XGBoost': XGBClassifier(learning_rate=0.01, n_estimators=100, max_depth=5,
                                     gamma=0.5, subsample=0.8, colsample_bytree=0.8,
                                     random_state=42, reg_lambda=1),
            'KNN': KNeighborsClassifier(n_neighbors=5),
            'Decision Tree': DecisionTreeClassifier(criterion='gini', random_state=42, max_depth=8)
        }
        self.scaler = StandardScaler()
        self.feature_names = None
        self.target_column = "Diagnosis"  # Default target column
        
    def train(self, data_path):
        """Train all models on the gastric cancer dataset"""
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
        
        # Check if the target column exists
        if self.target_column not in data.columns:
            print(f"\nWarning: Target column '{self.target_column}' not found in dataset.")
            print("Available columns:", data.columns.tolist())
            print("\nPlease specify the correct target column name:")
            
            # Let's assume the target column is the last column if 'Diagnosis' isn't found
            self.target_column = data.columns[-1]
            print(f"Using '{self.target_column}' as the target column.")
        
        # Extract target and features
        y = data[self.target_column]
        X = data.drop(self.target_column, axis=1)
        
        # Store original feature names
        self.feature_names = X.columns.tolist()
        print(f"\nFeatures being used: {self.feature_names}")
        
        # Handle missing values
        print("\nChecking for missing values...")
        missing_values = X.isnull().sum()
        print(missing_values[missing_values > 0])
        
        # Identify numeric and categorical columns
        numeric_columns = X.select_dtypes(include=['int64', 'float64']).columns
        categorical_columns = X.select_dtypes(include=['object']).columns
        
        print(f"\nNumeric columns: {len(numeric_columns)}")
        print(f"Categorical columns: {len(categorical_columns)}")
        
        # Handle different column types separately
        # For numeric columns, fill missing values with mean
        for col in numeric_columns:
            if X[col].isnull().sum() > 0:
                X[col] = X[col].fillna(X[col].mean())
                
        # For categorical columns, fill missing values with the most frequent value
        for col in categorical_columns:
            if X[col].isnull().sum() > 0:
                X[col] = X[col].fillna(X[col].mode()[0])
        
        # Convert categorical variables to numeric
        if len(categorical_columns) > 0:
            print(f"\nEncoding categorical columns: {categorical_columns.tolist()}")
            X = pd.get_dummies(X, columns=categorical_columns, drop_first=True)
        
        # Store the encoded feature names
        self.encoded_feature_names = X.columns.tolist()
        
        # Handle any string columns that might not have been captured as categorical
        for col in X.columns:
            if X[col].dtype == object:
                try:
                    X[col] = X[col].astype(float)
                except:
                    print(f"Converting column {col} to categorical...")
                    X[col] = pd.Categorical(X[col]).codes
        
        # Final check for any remaining non-numeric data
        non_numeric = X.select_dtypes(exclude=['int64', 'float64']).columns
        if len(non_numeric) > 0:
            print(f"Warning: Non-numeric columns remaining: {non_numeric.tolist()}")
            print("Converting these columns to numeric...")
            for col in non_numeric:
                X[col] = pd.to_numeric(X[col], errors='coerce')
                X[col] = X[col].fillna(X[col].mean())
        
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
            try:
                model.fit(X_train_scaled, y_train)
                train_score = model.score(X_train_scaled, y_train)
                test_score = model.score(X_test_scaled, y_test)
                self.model_performance[name] = {
                    'train_score': train_score,
                    'test_score': test_score
                }
                print(f"{name} - Train Score: {train_score:.4f}, Test Score: {test_score:.4f}")
            except Exception as e:
                print(f"Error training {name}: {str(e)}")
                self.model_performance[name] = {
                    'train_score': None,
                    'test_score': None,
                    'error': str(e)
                }

    def save_models(self, save_path):
        """Save all models and components"""
        print(f"\nSaving models to: {save_path}")
        save_dict = {
            'models': self.models,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'encoded_feature_names': self.encoded_feature_names,
            'model_performance': self.model_performance,
            'target_column': self.target_column
        }
        with open(save_path, 'wb') as f:
            pickle.dump(save_dict, f)
        print("Models saved successfully!")
        
    def predict(self, data):
        """Make predictions using all models"""
        predictions = {}
        
        # Ensure data has the right format
        if isinstance(data, pd.DataFrame):
            # Check if columns match expected features
            missing_cols = set(self.feature_names) - set(data.columns)
            if missing_cols:
                raise ValueError(f"Missing columns in input data: {missing_cols}")
            
            # Reorder columns to match training data
            data = data[self.feature_names]
        else:
            raise ValueError("Input data must be a pandas DataFrame")
            
        # Handle missing values the same way as in training
        for col in data.columns:
            if data[col].dtype in [np.int64, np.float64]:
                data[col] = data[col].fillna(data[col].mean())
            else:
                data[col] = data[col].fillna(data[col].mode()[0])
                
        # Process categorical variables
        categorical_columns = data.select_dtypes(include=['object']).columns
        if len(categorical_columns) > 0:
            data = pd.get_dummies(data, columns=categorical_columns, drop_first=True)
        
        # Convert any remaining non-numeric columns
        for col in data.columns:
            if data[col].dtype == object:
                try:
                    data[col] = data[col].astype(float)
                except:
                    data[col] = pd.Categorical(data[col]).codes
        
        # Align columns with the training data columns
        for col in self.encoded_feature_names:
            if col not in data.columns:
                data[col] = 0
        
        data = data[self.encoded_feature_names]
        
        # Scale the data
        data_scaled = self.scaler.transform(data)
        
        # Make predictions with each model
        for name, model in self.models.items():
            if name in self.model_performance and self.model_performance[name].get('error') is None:
                try:
                    predictions[name] = model.predict(data_scaled)
                except Exception as e:
                    predictions[name] = f"Error predicting: {str(e)}"
            
        return predictions

if __name__ == "__main__":
    try:
        # Define paths
        current_dir = os.path.dirname(os.path.abspath(__file__))
        DATA_PATH = os.path.join(current_dir, "gastric_cancer.csv")
        MODEL_SAVE_PATH = os.path.join(current_dir, "gastric_cancer_ensemble.pkl")
        
        print("Starting model training process...")
        print(f"Current directory: {current_dir}")
        
        # Initialize and train
        predictor = GastricCancerEnsemblePredictor()
        predictor.train(DATA_PATH)
        
        # Save the trained model
        predictor.save_models(MODEL_SAVE_PATH)
        
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        print("\nPlease ensure:")
        print("1. The gastric_cancer.csv file is in the same directory as this script")
        print("2. The file contains the expected columns")
        print("3. You have sufficient permissions to read/write in this directory")