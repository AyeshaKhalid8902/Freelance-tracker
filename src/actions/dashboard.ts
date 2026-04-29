"use server";

import { prisma } from "@/lib/prisma"; // ✅ Ensure this path is correct across all files
import { revalidatePath } from "next/cache";

export async function getDashboardStats() {
  try {
    // 1. Total Revenue (Sirf PAID invoices ka sum)
    const totalRevenue = await prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });

    // 2. Total Projects (Active count for dashboard)
    const activeProjectsCount = await prisma.project.count();

    // 3. Tasks Count (Status "Todo" se match kiya jo aapke database mein hai)
    const pendingTasksCount = await prisma.task.count({
      where: { 
        status: {
          in: ["Todo", "PENDING", "In Progress"] // Taake koi bhi status miss na ho
        }
      },
    });

    // 4. Unique Happy Clients (The logic to fix the "1" issue)
    // Hum projects table se saari unique clientId nikal rahe hain
    const projects = await prisma.project.findMany({
      select: { clientId: true },
    });
    
    // Set ensures that even if one client has 10 projects, they are counted as 1 client
    const uniqueClientIds = new Set(projects.map(p => p.clientId).filter(Boolean));
    const happyClientsCount = uniqueClientIds.size;

    // 5. Recent Clients list (For the activity feed/table)
    const recentClients = await prisma.client.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Revalidate taake data fresh rahe
    revalidatePath("/dashboard");

    return {
      revenue: Number(totalRevenue._sum.amount) || 0,
      projects: activeProjectsCount,
      tasks: pendingTasksCount,
      clientsCount: happyClientsCount, // 👈 This will now return 4 if 4 unique clients have projects
      recentClients: recentClients,
    };
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error.message);
    return {
      revenue: 0,
      projects: 0,
      tasks: 0,
      clientsCount: 0,
      recentClients: [],
    };
  }
}