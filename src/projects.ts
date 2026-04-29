"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Database se projects lane ka function
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: true, 
        tasks: true,    
        invoices: true, 
      }
    });
    return projects;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

// 2. Naya project save karne ka function
export async function createProject(formData: { name: string; clientId: string; budget: number }) {
  try {
    // User check/create logic
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Ayesha Khalid",
          email: "ayesha@example.com",
        }
      });
    }

    const project = await prisma.project.create({
      data: {
        name: formData.name,
        budget: parseFloat(formData.budget.toString()), 
        status: "Pending", // ✅ Schema mein field add hone ke baad ab error nahi aayega
        client: {
          connect: { id: formData.clientId }
        },
        user: {
          connect: { id: user.id }
        }
      },
    });

    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, project };
  } catch (error: any) {
    console.error("Database error:", error.message);
    return { success: false, error: error.message };
  }
}

// 3. Project ka status update karne ka function (Launch Fix)
export async function updateProjectStatus(id: string, status: string) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { 
        status: status // ✅ Ab yahan red line nahi aani chahiye
      },
    });
    
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, project: updatedProject };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// 4. Project delete karne ka function
export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to delete project" };
  }
}