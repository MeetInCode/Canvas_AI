"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function updateUserProfile(
  clerkId: string,
  data: { name: string; email: string }
) {
  try {
    // First check if the user exists
    const existingUser = await db.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: {
        clerkId: clerkId,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    console.log("✅✅ User profile updated successfully");
    revalidatePath("/settings");
    return { success: true, user: updatedUser };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Email already in use by another account",
        };
      }
    }

    return { success: false, error: "Failed to update user profile" };
  }
}
