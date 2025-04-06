import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to connect to the database
    await db.$connect();
    console.log("Database connection successful");

    // Try to query the users table
    const userCount = await db.user.count();
    console.log("User count:", userCount);

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Database connection failed",
        details: error,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
