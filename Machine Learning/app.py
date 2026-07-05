from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
# Enable CORS for all routes, allows the frontend to easily call this API
CORS(app)

# Load the trained model and scaler
try:
    model = joblib.load('model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Successfully loaded model and scaler.")
except Exception as e:
    print(f"Error loading model/scaler: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "active", "message": "API is running"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the frontend
        data = request.get_json()
        
        # Expected input features:
        # Age, SPO2, Body Temperature, Systolic_BP, Diastolic_BP, 
        # Sex_Encoded, ICU_Encoded, Age_Group_Encoded, Diagnosis_Encoded
        
        # Convert dictionary to DataFrame for easier manipulation
        df_input = pd.DataFrame([data])
        
        # Feature Engineering (same as training pipeline)
        df_input['Pulse_Pressure'] = df_input['Systolic_BP'] - df_input['Diastolic_BP']
        df_input['MAP'] = df_input['Diastolic_BP'] + (df_input['Systolic_BP'] - df_input['Diastolic_BP']) / 3.0
        
        # Scaling numeric features
        scale_cols = ['Age', 'SPO2', 'Body Temperature', 'Systolic_BP', 'Diastolic_BP', 'Pulse_Pressure', 'MAP']
        df_input[scale_cols] = scaler.transform(df_input[scale_cols])
        
        # Final feature alignment
        final_features = scale_cols + ['Sex_Encoded', 'ICU_Encoded', 'Age_Group_Encoded', 'Diagnosis_Encoded']
        X_input = df_input[final_features]
        
        # Prediction
        prediction = model.predict(X_input)[0]
        
        # Format response
        result_text = "Prolonged Recovery (> 7 days)" if prediction == 1 else "Fast Recovery (<= 7 days)"
        
        return jsonify({
            "status": "success",
            "prediction_code": int(prediction),
            "prediction_text": result_text,
            "message": "Prediction generated successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
