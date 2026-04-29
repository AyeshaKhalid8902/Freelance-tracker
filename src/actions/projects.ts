"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. PROJECTS FETCH KARNE KA FUNCTION (With Client Data)
export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({ 
            include: {
                client: true, // 👈 Ye dashboard stats ko 4 karne ke liye bohot zaroori hai
            },
            orderBy: { createdAt: 'desc' },
            take: 100 
        });
        return { success: true, projects };
    } catch (e: any) { 
        console.error("Fetch Error:", e);
        return { success: false, projects: [] }; 
    }
}

// 2. PROJECT CREATE KARNE KA FUNCTION (Fixed Client Logic)
export async function createProject(data: { 
    title: string; 
    category: string; 
    image?: string; 
    status: string; 
    budget: number;
    clientId: string; // 👈 Ise required kar diya taake mistake na ho
}) {
    try {
        const user = await prisma.user.findFirst();
        
        // Agar dropdown se ID nahi aayi toh fallback client lo
        let targetClientId = data.clientId;
        
        if (!targetClientId || targetClientId === "") {
            const defaultClient = await prisma.client.findFirst();
            targetClientId = defaultClient?.id || "";
        }
        
        if(!user || !targetClientId) {
            throw new Error("User ya Client database mein nahi mila.");
        }

        const newProject = await prisma.project.create({
            data: {
                title: data.title,
                category: data.category,
                image: data.image || "",
                status: data.status || "draft",
                budget: Number(data.budget), 
                userId: user.id,
                clientId: targetClientId, // 👈 Ab sahi client hi save hoga
            }
        });

        // Sab pages ka data refresh karein
        revalidatePath("/dashboard");
        revalidatePath("/projects"); 
        revalidatePath("/clients");
        
        return { success: true, data: newProject };
    } catch (e: any) { 
        console.error("Create Error:", e.message);
        return { success: false, error: e.message }; 
    }
}

// 3. PROJECT DELETE KARNE KA FUNCTION
export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({ 
            where: { id } 
        });
        
        revalidatePath("/dashboard");
        revalidatePath("/projects");
        
        return { success: true };
    } catch (e: any) { 
        console.error("Delete Error:", e);
        return { success: false }; 
    }
}