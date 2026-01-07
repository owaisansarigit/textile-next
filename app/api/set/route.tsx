const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const jsonResponse = (data: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const GET = async (request: Request) => {
  try {
    await delay(300);

    return jsonResponse({
      success: true,
      message: "Hello from GET API!",
      method: "GET",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return jsonResponse(
      {
        success: false,
        message: "Internal Server Error",
        error: error?.message ?? "Unknown error",
      },
      500
    );
  }
};

export const POST = async (request: Request) => {
  try {
    await delay(500);

    const body = await request.json();

    return jsonResponse({
      success: true,
      message: "Hello from POST API!",
      method: "POST",
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return jsonResponse(
      {
        success: false,
        message: "Invalid request payload",
        error: error?.message ?? "Bad Request",
      },
      400
    );
  }
};
