import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req, context) {
  try {
    //  params is async
    const { interviewId } = await context.params;

    console.log(" Fetching feedback for:", interviewId);

    if (!interviewId) {
      return NextResponse.json([], { status: 200 });
    }

    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error(" Feedback API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 },
    );
  }
}
