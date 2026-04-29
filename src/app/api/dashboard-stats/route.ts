import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Parallel fetching taake performance fast rahe
    const [revenueData, activeProjects, projectsForClients, deadlines] = await Promise.all([
      // Revenue fetch karna (Status PAID wale)
      prisma.invoice.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      // Total active projects ka count
      prisma.project.count(),
      // Clients ki detail fetch karna unique count nikalne ke liye
      prisma.project.findMany({ 
        select: { clientId: true } 
      }),
      // Aapka purana deadlines fetch karne ka logic
      prisma.task.findMany({
        where: { status: { not: 'COMPLETED' } },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // 2. Unique Happy Clients ka logic (Jo count 1 se 4 barhay ga)
    // Hum Set use kar rahe hain taake agar ek client ke 10 projects bhi hon toh wo 1 hi count ho
    const uniqueClientIds = new Set(
      projectsForClients.map(p => p.clientId).filter(Boolean)
    );

    // 3. Poora data JSON format mein return karna
    return NextResponse.json({
      revenue: Number(revenueData._sum.amount) || 0,
      projects: activeProjects,
      clientsCount: uniqueClientIds.size, // 👈 Ye dashboard par ab 4 dikhaye ga
      deadlines: deadlines.map(d => ({
        title: d.title,
        // Date formatting logic
        deadline: d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-GB') : "No Deadline"
      }))
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch dashboard data",
      deadlines: [] 
    }, { status: 500 });
  }
}