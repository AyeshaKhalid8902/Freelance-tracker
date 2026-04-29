import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { clientId, amount } = await req.json();
    const clientExists = await prisma.client.findUnique({ where: { id: clientId } });

    if (!clientExists) {
      return NextResponse.json({ error: "Client ID not found" }, { status: 404 });
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        amount: parseFloat(amount.toString()),
        status: "PENDING",
        clientId: clientId,
      },
    });
    return NextResponse.json(newInvoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}