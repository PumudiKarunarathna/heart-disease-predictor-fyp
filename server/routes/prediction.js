const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const authenticateUser = require('../middleware/authenticateUser');

// Route for making a heart disease prediction
router.post('/predict', authenticateUser, async (req, res) => {
    try {
        // console.log('Full Request Body:', JSON.stringify(req.body, null, 2));
        
        const {
            Age, Sex, ChestPainType, RestingBP, Cholesterol,
            FastingBS, RestingECG, MaxHR, ExerciseAngina, 
            Oldpeak, ST_Slope
        } = req.body;

        const requiredFields = [
            'Age', 'Sex', 'ChestPainType', 'RestingBP', 
            'Cholesterol', 'FastingBS', 'RestingECG', 
            'MaxHR', 'ExerciseAngina', 'Oldpeak', 'ST_Slope'
        ];

        const missingFields = requiredFields.filter(field => 
            req.body[field] === undefined || req.body[field] === null
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const predictionResult = await predictionController.makePrediction({
            Age, Sex, ChestPainType, RestingBP, Cholesterol,
            FastingBS, RestingECG, MaxHR, ExerciseAngina, 
            Oldpeak, ST_Slope
        });

        res.json({
            success: true,
            prediction: predictionResult,
            user: req.user.id
        });

    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing prediction',
            error: error.message
        });
    }
});

// Route to get prediction history for authenticated user
router.get('/prediction-history', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await predictionController.getPredictionHistory(userId);
        
        res.json({
            success: true,
            predictionHistory: history
        });
    } catch (error) {
        console.error('Prediction History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving prediction history'
        });
    }
});

module.exports = router;