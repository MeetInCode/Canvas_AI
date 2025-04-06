import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("Test endpoint hit - attempting to create dummy user");
  try {
    const userData = {
      clerkId: "test_clerk_id_" + Date.now(),
      email: "test_" + Date.now() + "@example.com",
      name: "Test User",
      profileImage: "https://example.com/test-image.jpg",
    };

    console.log("Attempting to create user with data:", userData);

    const dummyUser = await db.user.create({
      data: userData,
    });

    console.log("Successfully created user:", dummyUser);
    return NextResponse.json({ success: true, user: dummyUser });
  } catch (error) {
    console.error("Detailed error creating test user:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create test user",
        details: error,
      },
      { status: 500 }
    );
  }
}
