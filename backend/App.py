from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Load YOLO Model
model = YOLO("yolov8n.pt")

# HOME ROUTE
@app.route("/")
def home():
    return "FoodSafe AI Backend Running"

# DETECTION ROUTE
@app.route("/detect", methods=["POST"])
def detect():
    file = request.files["image"]

    image_bytes = file.read()

    npimg = np.frombuffer(image_bytes, np.uint8)

    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(img)

    detections = []

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])

            detections.append({
                "class": model.names[cls],
                "confidence": round(conf * 100, 2)
            })

    return jsonify({
        "success": True,
        "detections": detections
    })

if __name__ == "__main__":
    app.run(debug=True)