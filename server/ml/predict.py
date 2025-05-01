import sys
import json
import pickle
import os
import numpy as np
import pandas as pd

class DualConditionPredictor:
    def __init__(self):
        self.models = {
            'heart_disease': None,
            'gastric_cancer': None
        }
        self.required_fields = {
            'heart_disease': {
                'Age': (int, float, lambda x: 0 <= x <= 120),
                'Sex': (str, lambda x: x in ['M', 'F']),
                'ChestPainType': (str, lambda x: x in ['ATA', 'NAP', 'ASY', 'TA']),
                'RestingBP': (int, float, lambda x: 0 <= x <= 300),
                'Cholesterol': (int, float, lambda x: 0 <= x <= 1000),
                'FastingBS': (int, str, lambda x: str(x) in ['0', '1']),
                'RestingECG': (str, lambda x: x in ['Normal', 'ST', 'LVH']),
                'MaxHR': (int, float, lambda x: 0 <= x <= 300),
                'ExerciseAngina': (str, lambda x: x in ['Y', 'N']),
                'Oldpeak': (float, lambda x: -10 <= x <= 10),
                'ST_Slope': (str, lambda x: x in ['Up', 'Flat', 'Down'])
            },
            'gastric_cancer': None  # Will be populated after loading the model
        }
        
        # List of key gastric cancer fields that user will provide
        self.key_gastric_fields = [
            'age', 'gender', 'alcohol_consumption', 'ct_scan', 
            'dietary_habits', 'geographical_location', 'existing_conditions', 
            'biopsy_results', 'family_history', 'smoking_habits'
        ]
        
        # Default values for other gastric cancer fields
        self.other_gastric_defaults = {
            # miRNA-related defaults
            'mature_mirna_acc': 'MI0000077',
            'mature_mirna_id': 'hsa-miR-21',
            'mirdb': True,
            'pictar': True,
            'pita': 0.5,
            'microcosm': True,
            'miranda': True,
            'targetscan': True,
            'diana_microt': True,
            'elmmo': 3,
            
            # Target gene defaults
            'target_entrez': '5290',
            'target_symbol': 'TP53',
            'target_ensembl': 'ENSG00000146648',
            
            # Sum values
            'predicted.sum': 8,
            'all.sum': 10,
            
            # Other fields
            'helicobacter_pylori_infection': True,
            'endoscopic_images': 'Available'
        }
    
    def load_models(self):
        """Load both the heart disease and gastric cancer models"""
        try:
            # Load heart disease model
            heart_model_path = os.path.join(os.path.dirname(__file__), 'heart_disease_ensemble.pkl')
            with open(heart_model_path, 'rb') as f:
                self.models['heart_disease'] = pickle.load(f)
                
            # Load gastric cancer model
            gastric_model_path = os.path.join(os.path.dirname(__file__), 'gastric_cancer_ensemble.pkl')
            with open(gastric_model_path, 'rb') as f:
                gastric_model = pickle.load(f)
                self.models['gastric_cancer'] = gastric_model
                
                # Set gastric cancer required fields based on features in the model
                self.required_fields['gastric_cancer'] = {
                    field: (int, float, str) for field in gastric_model['feature_names']
                }
                
            return True
        except Exception as e:
            raise Exception(f"Failed to load models: {str(e)}")
    
    def validate_input(self, data, condition_type):
        """Validate input data against required fields for the specific condition"""
        if condition_type not in self.models:
            raise ValueError(f"Invalid condition type: {condition_type}. Must be 'heart_disease' or 'gastric_cancer'")
        
        if not self.models[condition_type]:
            self.load_models()
            
        required_fields = self.required_fields[condition_type]
        
        # Handle gastric cancer input more flexibly
        if condition_type == 'gastric_cancer':
            # Fix capitalization issues - if 'age' exists but 'Age' is required, use the lowercase version
            normalized_data = {}
            field_map = {}
            
            # Create a case-insensitive mapping of field names
            for field in data:
                field_map[field.lower()] = field
            
            # Try to map all required fields using case-insensitive matching
            for required_field in required_fields:
                if required_field in data:
                    normalized_data[required_field] = data[required_field]
                elif required_field.lower() in field_map:
                    normalized_data[required_field] = data[field_map[required_field.lower()]]
                else:
                    # For fields not in the key fields list, use our default values
                    if required_field.lower() in self.other_gastric_defaults:
                        normalized_data[required_field] = self.other_gastric_defaults[required_field.lower()]
                    # For missing fields, provide generic default values
                    elif isinstance(required_field, str) and ('mirna' in required_field.lower() or 'target' in required_field.lower()):
                        normalized_data[required_field] = "unknown"
                    elif 'sum' in required_field.lower():
                        normalized_data[required_field] = 0
                    elif required_field.lower() in ['true', 'false']:
                        normalized_data[required_field] = False
                    else:
                        normalized_data[required_field] = 0
            
            # Add any fields that might be needed but weren't in required_fields
            for field in self.models[condition_type]['feature_names']:
                if field not in normalized_data:
                    if field in data:
                        normalized_data[field] = data[field]
                    elif field.lower() in field_map:
                        normalized_data[field] = data[field_map[field.lower()]]
                    else:
                        # Use our comprehensive defaults for other fields
                        if field.lower() in self.other_gastric_defaults:
                            normalized_data[field] = self.other_gastric_defaults[field.lower()]
                        # Default values for missing fields
                        elif isinstance(field, str) and ('mirna' in field.lower() or 'target' in field.lower()):
                            normalized_data[field] = "unknown"
                        elif 'sum' in field.lower():
                            normalized_data[field] = 0
                        elif field.lower() in ['true', 'false']:
                            normalized_data[field] = False
                        else:
                            normalized_data[field] = 0
                            
            return normalized_data
            
        # For heart disease, we have specific validation rules
        for field, validators in required_fields.items():
            if field not in data:
                raise ValueError(f"Missing required field: {field}")
            
            value = data[field]
            valid = False
            
            for validator in validators:
                if isinstance(validator, type):
                    try:
                        data[field] = validator(value)
                        valid = True
                        break
                    except:
                        continue
                elif callable(validator):
                    try:
                        if validator(value):
                            valid = True
                            break
                    except:
                        continue
            
            if not valid:
                raise ValueError(f"Invalid value for {field}: {value}")

        return data
    
    def prepare_input(self, data, condition_type):
        """Prepare input data for prediction for the specific condition"""
        model_dict = self.models[condition_type]
        
        # Convert to DataFrame
        input_df = pd.DataFrame([data])
        
        # For gastric cancer, handle missing values the same way as in training
        if condition_type == 'gastric_cancer':
            # Handle feature preparation specifically for gastric cancer
            try:
                # First, ensure we have all the required columns
                for col in model_dict['feature_names']:
                    if col not in input_df.columns:
                        # Add missing columns with default values from our defaults dictionary
                        if col.lower() in self.other_gastric_defaults:
                            input_df[col] = self.other_gastric_defaults[col.lower()]
                        # Otherwise use generic defaults
                        elif isinstance(col, str) and ('mirna' in col.lower() or 'target' in col.lower()):
                            input_df[col] = "unknown"
                        elif 'sum' in str(col).lower():
                            input_df[col] = 0
                        elif str(col).lower() in ['true', 'false']:
                            input_df[col] = False
                        else:
                            input_df[col] = 0
                
                # Remove any extra columns not needed by the model
                for col in input_df.columns:
                    if col not in model_dict['feature_names']:
                        input_df = input_df.drop(col, axis=1)
            except Exception as e:
                print(f"Error in gastric cancer preparation: {str(e)}")
                raise
        
        # Convert categorical variables to dummy variables
        try:
            input_encoded = pd.get_dummies(input_df, drop_first=True)
            
            # Ensure all encoded features are present
            for col in model_dict['encoded_feature_names']:
                if col not in input_encoded.columns:
                    input_encoded[col] = 0
                    
            # Reorder columns to match training data
            input_encoded = input_encoded[model_dict['encoded_feature_names']]
            
            # Scale the features
            input_scaled = model_dict['scaler'].transform(input_encoded)
            
            return input_scaled
        except Exception as e:
            print(f"Error encoding/scaling: {str(e)}")
            raise
    
    def predict(self, input_data, condition_type=None):
        """
        Make predictions using the ensemble of models
        
        Args:
            input_data: Dictionary with input features
            condition_type: 'heart_disease', 'gastric_cancer', or None (for differential diagnosis)
            
        Returns:
            Dictionary with predictions for each model and ensemble
        """
        # Load models if not already loaded
        if not all(self.models.values()):
            self.load_models()
        
        # If condition_type is not specified, perform differential diagnosis
        if condition_type is None:
            results = {}
            # Try to predict with both models if possible
            try:
                heart_preds = self.predict(input_data, 'heart_disease')
                results['heart_disease'] = heart_preds
            except Exception as e:
                results['heart_disease'] = {'error': str(e)}
                
            try:
                gastric_preds = self.predict(input_data, 'gastric_cancer')
                results['gastric_cancer'] = gastric_preds
            except Exception as e:
                results['gastric_cancer'] = {'error': str(e)}
                
            # Determine the most likely condition
            if 'error' not in results['heart_disease'] and 'error' not in results['gastric_cancer']:
                heart_prob = results['heart_disease']['ensemble']['probability']
                gastric_prob = results['gastric_cancer']['ensemble']['probability']
                
                if heart_prob > gastric_prob:
                    results['differential_diagnosis'] = {
                        'most_likely_condition': 'heart_disease',
                        'confidence': float(heart_prob / (heart_prob + gastric_prob)) if (heart_prob + gastric_prob) > 0 else 0.5
                    }
                else:
                    results['differential_diagnosis'] = {
                        'most_likely_condition': 'gastric_cancer',
                        'confidence': float(gastric_prob / (heart_prob + gastric_prob)) if (heart_prob + gastric_prob) > 0 else 0.5
                    }
                    
            return results
        
        # Validate input for the specific condition
        validated_data = self.validate_input(input_data, condition_type)
        
        # Prepare input for prediction
        input_scaled = self.prepare_input(validated_data, condition_type)
        
        # Make predictions with each model
        predictions = {}
        model_dict = self.models[condition_type]
        
        for name, model in model_dict['models'].items():
            try:
                # Check if model has predict_proba method
                if hasattr(model, 'predict_proba'):
                    # Get prediction and probability
                    pred = model.predict(input_scaled)[0]
                    prob = model.predict_proba(input_scaled)[0][1] if pred == 1 else 1 - model.predict_proba(input_scaled)[0][0]
                    
                    # Get model accuracy from saved performance metrics
                    model_accuracy = model_dict['model_performance'][name]['test_score']
                    
                    predictions[name] = {
                        'prediction': int(pred),
                        'probability': float(prob),
                        'model_accuracy': float(model_accuracy)
                    }
                else:
                    # For models without predict_proba
                    pred = model.predict(input_scaled)[0]
                    
                    # Get model accuracy from saved performance metrics
                    model_accuracy = model_dict['model_performance'][name]['test_score']
                    
                    predictions[name] = {
                        'prediction': int(pred),
                        'probability': None,
                        'model_accuracy': float(model_accuracy)
                    }
            except Exception as e:
                predictions[name] = {'error': str(e)}
        
        # Calculate ensemble prediction
        valid_preds = [p for p in predictions.values() if 'error' not in p and p['probability'] is not None]
        if valid_preds:
            ensemble_pred = np.round(np.mean([pred['prediction'] for pred in valid_preds]))
            ensemble_prob = np.mean([pred['probability'] for pred in valid_preds])
            ensemble_accuracy = np.mean([pred['model_accuracy'] for pred in valid_preds])
            
            # Add ensemble results
            predictions['ensemble'] = {
                'prediction': int(ensemble_pred),
                'probability': float(ensemble_prob),
                'model_accuracy': float(ensemble_accuracy)
            }
        
        return predictions


def predict(input_data, condition_type=None):
    """
    Predict heart disease, gastric cancer, or both based on input data
    
    Args:
        input_data: Dictionary with input features
        condition_type: 'heart_disease', 'gastric_cancer', or None (for differential diagnosis)
        
    Returns:
        Dictionary with predictions for each model and ensemble
    """
    try:
        predictor = DualConditionPredictor()
        return predictor.predict(input_data, condition_type)
    except Exception as e:
        return {'error': str(e)}


if __name__ == "__main__":
    try:
        # Read input from stdin
        input_json = sys.stdin.read()
        input_data = json.loads(input_json)
        
        # Check if condition_type is specified
        condition_type = input_data.pop('condition_type', None) if isinstance(input_data, dict) else None
        
        # Make prediction
        predictions = predict(input_data, condition_type)
        
        # Print results as JSON
        print(json.dumps(predictions))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)