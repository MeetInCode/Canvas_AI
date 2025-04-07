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

    // Get a sample of users
    const users = await db.user.findMany({
      take: 5,
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    console.log("Sample users:", users);

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      sampleUsers: users,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

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
