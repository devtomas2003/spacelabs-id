import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest){
  const clientId = req.nextUrl.searchParams.get("clientId");
  const redirectUri = req.nextUrl.searchParams.get("redirectUri");
  const scopes = req.nextUrl.searchParams.get("scopes");

  if(!clientId || !redirectUri || !scopes){
    return new Response(JSON.stringify({
      message: "Faltam dados necessarios para a autenticação!"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apps = await prisma.apps.findUnique({
    where: {
      id: clientId
    },
    select: {
      appName: true
    }
  });

  if(!apps){
    return new Response(JSON.stringify({
      message: "Aplicação OAuth invalida!"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(apps), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}