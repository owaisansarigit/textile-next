export async function GET(request) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return Response.json({
    message: "Hello from GET API!",
    timestamp: new Date().toISOString(),
    method: "GET",
  });
}

export async function POST(request) {  
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const body = await request.json();
    console.log(body)
    return Response.json({
      message: "Hello from POST API!",
      receivedData: body,
      timestamp: new Date().toISOString(),
      method: "POST",
      status: "success",
    });
  } catch (error) {
    return Response.json(
      {
        message: "Error processing request",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
