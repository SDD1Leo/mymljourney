import { NextResponse } from "next/server";

const initialModels = [
  { id: 1, name: 'OptiDigit', type: 'CNN Vision Model', description: 'A custom Convolutional Neural Network trained on MNIST and extended datasets to recognize handwritten digits with high accuracy.', stats: '98.5% Accuracy', tech: ['PyTorch', 'OpenCV'] },
  { id: 2, name: 'Sentiment-X', type: 'NLP Classifier', description: 'Fine-tuned BERT model for analyzing product review sentiments in real-time.', stats: 'F1-Score: 0.91', tech: ['HuggingFace', 'FastAPI'] },
];

export async function GET() {
  return NextResponse.json({
    message: "initial models from api",
    data: initialModels,
  });
}