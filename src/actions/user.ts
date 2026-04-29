"use server";

import { prisma } from "./prisma.config";
import { revalidatePath } from "next/cache";

// Humne 'image' field add ki hai profile picture ke liye
export async function updateProfile(data: { 
  name: string; 
  email: string; 
  bio: string;
  image?: string | null; 
}) {
  try {
    const formattedEmail = data.email.trim().toLowerCase();

    const user = await prisma.user.upsert({
      where: { 
        email: formattedEmail 
      },
      update: {
        name: data.name,
        bio: data.bio,
        image: data.image, // Image update logic
      },
      create: {
        email: formattedEmail,
        name: data.name,
        bio: data.bio,
        image: data.image,
      },
    });

    console.log("Profile Sync Successful for:", user.email);
    
    // In dono paths ko revalidate karein taake settings page par bhi update dikhe
    revalidatePath("/settings/profile"); 
    revalidatePath("/settings"); 
    
    return { success: true, user };
  } catch (error) {
    console.error("Critical Save Error:", error);
    return { success: false, error: "Database sync failed" };
  }
}

// ✅ Optimized: Page load hote hi database se sahi data layega
export async function getUser(email: string) {
  if (!email) return null; // ✅ Check taake empty query na chaly
  try {
    // Unique fetch boht fast hota hai, 7 seconds tabhi lagtay hain jab connection pool full ho
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      // ✅ Performance fix: Sirf wo fields mangwayein jo dashboard par chahiye
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        emailNotify: true,
        desktopNotify: true,
        inquiryNotify: true
      }
    });
    return user;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export async function updateNotifications(email: string, prefs: {
  emailNotify: boolean;
  desktopNotify: boolean;
  inquiryNotify: boolean;
}) {
  try {
    await prisma.user.update({
      where: { email: email.trim().toLowerCase() }, // ✅ Consistency fix
      data: prefs,
    });
    revalidatePath("/settings/notifications");
    return { success: true };
  } catch (error) {
    console.error("Notification Update Error:", error);
    return { success: false };
  }
}