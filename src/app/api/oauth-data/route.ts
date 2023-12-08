import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import fs from "fs";
import type { IOAuthLocal } from '../../../Types/OAuth';
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
      headers: { "Content-Type": "application/json" }
    });
  }

  if(!isValidHttpsUrl(redirectUri)){
    return new Response(JSON.stringify({
      message: "Dominio OAuth invalido!"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apps = await prisma.apps.findUnique({
    where: {
      id: clientId
    },
    select: {
      appName: true,
      AllowedRedirectDomains: {
        select: {
          uri: true
        }
      },
      Scopes: {
        select: {
          id: true
        }
      }
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

  const { hostname } = new URL(redirectUri);
  const allowedDomains = apps.AllowedRedirectDomains.map((domain) => { return (domain.uri); });

  if(!allowedDomains.includes(hostname)){
    return new Response(JSON.stringify({
      message: "Dominio OAuth não permitido!"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const allowedScopes = apps.Scopes.map((scope) => { return (scope.id); });
  const listOfRequestedScopes = scopes.split(",");

  if(!checkScopes(listOfRequestedScopes, allowedScopes)){
    return new Response(JSON.stringify({
      message: "Scopes pedidos não permitidos!"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const preAuth = req.headers.get("Authorization") || "";
  const preAuthList = preAuth.split(" ");

  try{
    const userId = await validateJWT(preAuthList[1]);
    const userInfo = await prisma.users.findUnique({
      where: {
        userId: userId
      },
      select: {
        name: true
      }
    });
  
    return new Response(JSON.stringify({
      appName: apps.appName,
      userInfo
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }catch(err){
    return new Response(JSON.stringify({
      appName: apps.appName
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function isValidHttpsUrl(url: string) {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

function checkScopes(requestedScopes: string[], allowedScopes: string[]): boolean {
  return requestedScopes.every(reqScope => allowedScopes.includes(reqScope));
}

function validateJWT(key: string): Promise<string>{
  return new Promise((resolve, reject) => {
    fs.readFile('src/keys/public.key', (err, data) => {
      if(err){
        return reject('Sign File Read Error');
      }
      try {
        const localAuth = jwt.verify(key, data) as IOAuthLocal;
        resolve(localAuth.userId);
      }catch(err){
        reject("Tempo de sessão expirado!")
      }
    });
  });
}