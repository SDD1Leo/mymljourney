import { NextResponse } from "next/server";

const initialEpochs = [
  { id: 1, date: '2023-05-10', title: 'Initialized Weights', description: 'Started the journey. Learned Python basics, NumPy, and Pandas.', metric: 'Loss: 0.95' },
  { id: 2, date: '2023-08-22', title: 'First Forward Pass', description: 'Built my first Linear Regression model from scratch. Understood gradient descent.', metric: 'Loss: 0.60' },
  { id: 3, date: '2024-01-15', title: 'Entering the Hidden Layers', description: 'Mastered PyTorch basics. Built a CNN for image classification (MNIST).', metric: 'Acc: 92%' },
  { id: 4, date: '2024-06-30', title: 'Attention is All I Need', description: 'Started exploring NLP, Transformers, and playing with HuggingFace APIs.', metric: 'Acc: 96%' },
];

export async function GET() {
  return NextResponse.json({
    message: "initial epochs from api",
    data: initialEpochs,
  });
}

export async function POST(request: Request) {
  const { title, description, metric } = await request.json();
  const newEpoch = {
    id: initialEpochs.length + 1,
    date: new Date().toISOString(),
    title,
    description,
    metric,
  };
  initialEpochs.push(newEpoch);
  return NextResponse.json({
    message: "new epoch added",
    data: newEpoch,
  });
}