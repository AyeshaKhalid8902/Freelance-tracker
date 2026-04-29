"use server";

import { prisma } from "./prisma.config";
import { revalidatePath } from "next/cache";

// 1. Status Update karne ke liye
export async function updateInvoiceStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "UNPAID" ? "PAID" : "UNPAID";
    
    await prisma.invoice.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/invoices"); 
    revalidatePath("/dashboard"); // Dashboard stats bhi update honge
    return { success: true };
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return { success: false };
  }
}

// 2. Saare Invoices fetch karne ke liye (Optimized)
export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      // OPTIMIZATION: Sirf zaroori fields select karein
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        client: {
          select: {
            name: true,
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Dashboard aur list ke liye 50 kaafi hain
    });
    return { success: true, invoices };
  } catch (error: any) {
    console.error("Fetch Invoices Error:", error);
    return { success: false, invoices: [] };
  }
}

// 3. Dropdown mein clients dikhane ke liye
export async function getAllClients() {
  try {
    const clients = await prisma.client.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, clients };
  } catch (error: any) {
    return { success: false, clients: [] };
  }
}

// 4. Naya Invoice save karne ke liye
export async function createInvoice(data: { clientId: string; amount: number }) {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        clientId: data.clientId,
        amount: Number(data.amount), // Ensure number
        status: "UNPAID",
      },
    });

    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    return { success: true, invoice };
  } catch (error: any) {
    console.error("Invoice Creation Error:", error);
    return { success: false, error: error.message };
  }
}