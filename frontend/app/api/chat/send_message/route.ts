import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userQuery = formData.get('user_query') as string;
    const image = formData.get('image') as File | null;

    // Prepare the request to the Python backend
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    const backendFormData = new FormData();
    backendFormData.append('user_query', userQuery);

    if (image) {
      backendFormData.append('image', image);
    }

    // Send request to Python backend
    const backendResponse = await fetch(`${pythonBackendUrl}/chat`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      throw new Error('Backend request failed');
    }

    const data = await backendResponse.json();

    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 