const { spawn } = require('child_process');
const path = require('path');

const makePrediction = async (predictionData) => {
    return new Promise((resolve, reject) => {
        try {
            // console.log('Prediction Input Data:', predictionData);
            
            // Remove NumMajorVessels from required fields as it's not used in our model
            const requiredFields = [
                'Age', 'Sex', 'ChestPainType', 'RestingBP', 'Cholesterol',
                'FastingBS', 'RestingECG', 'MaxHR', 'ExerciseAngina', 
                'Oldpeak', 'ST_Slope'
            ];
            
            const missingFields = requiredFields.filter(field => 
                predictionData[field] === undefined || predictionData[field] === null
            );
            
            if (missingFields.length > 0) {
                reject(new Error(`Missing required fields: ${missingFields.join(', ')}`));
                return;
            }

            // Remove NumMajorVessels from the prediction data
            const { NumMajorVessels, ...cleanedData } = predictionData;

            const pythonScript = path.join(__dirname, '../ml/predict.py');
            const pythonProcess = spawn('python', [pythonScript]);

            let result = '';
            let error = '';

            // Send the cleaned data to Python script
            const jsonInput = JSON.stringify(cleanedData) + '\n';
            pythonProcess.stdin.write(jsonInput);
            pythonProcess.stdin.end();

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
                console.error('Python Error:', data.toString());
            });

            pythonProcess.on('error', (err) => {
                console.error('Process Spawn Error:', err);
                reject(new Error(`Failed to spawn Python process: ${err.message}`));
            });

            pythonProcess.on('close', (code) => {
                // console.log('Python Process Exit Code:', code);
                // console.log('Raw Result:', result);
                // console.log('Raw Error:', error);

                if (code !== 0) {
                    reject(new Error(`Prediction failed: ${error || 'Unknown error'}`));
                    return;
                }

                try {
                    const predictions = JSON.parse(result.trim());
                    
                    if (predictions.error) {
                        reject(new Error(predictions.error));
                        return;
                    }

                    // Format the predictions for the API response
                    const formattedPredictions = {
                        ensemble: predictions.ensemble,
                        modelPredictions: {}
                    };

                    // Add individual model predictions
                    Object.entries(predictions).forEach(([modelName, prediction]) => {
                        if (modelName !== 'ensemble') {
                            formattedPredictions.modelPredictions[modelName] = prediction;
                        }
                    });

                    resolve(formattedPredictions);
                } catch (e) {
                    reject(new Error(`Failed to process prediction: ${e.message}`));
                }
            });

        } catch (err) {
            console.error('Prediction Controller Error:', err);
            reject(new Error(`Prediction error: ${err.message}`));
        }
    });
};

const getPredictionHistory = async (userId) => {
    return [];
};

module.exports = {
    makePrediction,
    getPredictionHistory
};