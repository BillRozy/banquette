// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const encoder = new TextEncoder();
    // Create a streaming response
    const customReadable = new ReadableStream({
      start(controller) {
        const message = "A sample message.";
        controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      },
    });
    // Return the stream response and keep the connection alive
    return new Response(customReadable, {
      // Set the headers for Server-Sent Events (SSE)
      headers: {
        Connection: "keep-alive",
        "Content-Encoding": "none",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    });
  } finally {
    // clean up resources
  }
}
