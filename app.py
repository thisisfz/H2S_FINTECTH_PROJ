from tensorflow.keras.models import load_model
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
import numpy as np
import random
from datetime import datetime

# Load the trained Keras model
model = load_model('H2S_HACKATHON_MODEL.h5')

app = FastAPI()

class UserInput(BaseModel):
    name: str
    creditCardNumber: str
    validThrough: str
    cvv: str
    amount: float

@app.get('/')
async def index():
    return {"Message": "This is Index"}

@app.post('/predict/')
async def predict(data: UserInput):
    # Assuming a median and IQR for amount normalization
    median = 22.0
    iqr = 71.565
    
    # Normalize the amount
    normalized_amount = (data.amount - median) / iqr
    
    # Normalize the current time
    now = datetime.now()
    nornor=now.hour * 3600 + now.minute * 60 + now.second
    normalized_time = (nornor- 0.0) / (172792.0 - 0.0) # Normalize to a 0-1 range (day fraction)
    
    # Generate random values for variables (assuming your model requires these)
    variables = [random.uniform(-1, 1) for _ in range(28)]
    
    # Create a list with time as the first element, followed by variables, and amount as the last element
    features = [normalized_time] + variables + [normalized_amount]
    
    # Convert to a NumPy array and reshape for the model input
    input_array = np.array(features).reshape(1, -1)
    
    # Make the prediction
    try:
        prediction = model.predict(input_array)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    adjusted_prediction = 1 if prediction[0] >= 0.5 else 0
    
    return {"prediction": adjusted_prediction}
    
if __name__ == "__main__":
    import uvicorn
    # Ensure the app is listening on 0.0.0.0 and the correct port
    uvicorn.run(app, host="0.0.0.0", port=10000)  # Replace 10000 with the p
