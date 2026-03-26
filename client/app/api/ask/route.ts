import { NextRequest, NextResponse } from "next/server";

const QUIZ_BACKEND_URL =
  process.env.QUIZ_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${QUIZ_BACKEND_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            payload?.error ??
            "The quiz service could not generate questions right now.",
        },
        { status: response.status },
      );
    }

    const questions = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.questions)
        ? payload.questions
        : [];

    const meta =
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? payload.meta ?? null
        : null;

    return NextResponse.json({ questions, meta });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to reach the quiz service. Make sure the backend is running.",
      },
      { status: 500 },
    );
  }
}
