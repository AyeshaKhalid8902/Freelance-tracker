"use server"

import { prisma } from "./prisma.config";
import { revalidatePath } from "next/cache";

// 1. Project Create Function (Jo pehle se sahi chal raha hai)
export async function createProject(data: { 
  title: string, 
  clientId: string, 
  status: string, 
  budget: number,
  image: string,
  description: string 
}) {
  try {
    let activeUser = await prisma.user.findFirst();
    if (!activeUser) {
      activeUser = await prisma.user.create({
        data: { name: "Ayesha Khalid", email: "ayesha@example.com" }
      });
    }

    let targetClientId = data.clientId;
    const existingClient = await prisma.client.findFirst();
    if (!existingClient) {
      const defaultClient = await prisma.client.create({
        data: { name: "Default Client", email: "client@work.com" }
      });
      targetClientId = defaultClient.id;
    } else {
      targetClientId = existingClient.id;
    }

    const project = await (prisma.project as any).create({
      data: {
        title: data.title,
        clientId: targetClientId,
        status: data.status || "ACTIVE",
        budget: Number(data.budget),
        userId: activeUser.id,
        description: data.description || "",
        image: data.image || "", 
      },
    });

    revalidatePath("/projects");
    return { success: true, project };
  } catch (error: any) {
    console.error("Project Create Error:", error);
    return { success: false, error: error.message };
  }
}

// 2. Project UPDATE Function (Isay check karein)
export async function updateProject(id: string, data: any) {
  try {
    // Check karein ke ID aa rahi hai ya nahi
    if (!id) return { success: false, error: "Project ID is required for update." };

    const updatedProject = await (prisma.project as any).update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        // Budget ko number mein convert karna zaroori hai
        budget: data.budget ? Number(data.budget) : undefined,
        image: data.image,
      },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`); // Details page ko refresh karne ke liye
    return { success: true, project: updatedProject };
  } catch (error: any) {
    console.error("Update Project Error:", error);
    return { success: false, error: error.message };
  }
}