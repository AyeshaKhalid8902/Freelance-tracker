"use server";

import { prisma } from "./prisma.config";
import { revalidatePath } from "next/cache";

// 1. Naya Task Create karne ka function
export async function createNewTask(data: any) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title || "Untitled Task",
        description: data.description || data.title || "",
        status: data.status || "Todo",
        image: data.image || "", 
        category: data.category || "General",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    return { success: true, task };
  } catch (error: any) {
    console.error("Create Task Error:", error);
    return { success: false, error: error.message };
  }
}

// 2. Task Status Update karne ka function
export async function updateTaskStatus(id: string, status: string) {
  try {
    const updated = await prisma.task.update({
      where: { id: id },
      data: { status: status }
    });

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true, updated };
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return { success: false };
  }
}

// 3. Task Delete karne ka function
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id: id },
    });
    
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}

// 4. Dashboard aur Tasks page ka data fetch karne ka function (COMPLETE SYNC)
export async function getDashboardData() {
  try {
    // ✅ Performance Fix: Hum sirf dashboard ke liye zaroori latest data mangwayein ge
    // Is se 12 seconds wala load time kam ho kar 1-2 seconds par aa jaye ga
    const [tasks, projects, clients] = await Promise.all([
      // Dashboard par humein sirf top 5 tasks chahiye hotay hain
      prisma.task.findMany({ 
        take: 10, 
        orderBy: { createdAt: 'desc' } 
      }),
      // Projects fetch karna (Limit lagayi taake Neon DB par load na paray)
      prisma.project.findMany({ 
        take: 20,
        include: { 
          client: true 
        },
        orderBy: { id: 'desc' }
      }),
      // Clients fetch karna
      prisma.client.findMany({ 
        take: 50,
        orderBy: { name: 'asc' }
      })
    ]);
    
    return { tasks, projects, clients }; 
  } catch (error) {
    console.error("Fetch Error:", error);
    return { tasks: [], projects: [], clients: [] };
  }
}