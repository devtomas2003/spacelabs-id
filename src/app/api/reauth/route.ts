import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import type { IOAuthLocal } from "@/Types/OAuth";
const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    const authHeader = req.headers.get("Authorization");

    if(!authHeader){
        return new Response(JSON.stringify({
            message: "Cabeçalho Authorization não encontrado!"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    const authSplt = authHeader.split(" ");
    const jwtToken = authSplt[1];

    const jwtData = await validateJWT(jwtToken);

    if(!jwtData){
        return new Response(JSON.stringify({
            message: "Authorization inválido!"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    const user = await prisma.users.findUnique({
        where: {
            userId: jwtData
        }
    });

    if(!user){
        return new Response(JSON.stringify({
            message: "Utilizador não encontrado!"
        }), {
            status: 404,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    const signKey = await readFileData('src/keys/private.key');

    const localAuthKey = jwt.sign({ userId: jwtData }, signKey, {
        expiresIn: '3h',
        algorithm: 'RS512'
    });

    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);

    const keyOAuth = uuidv4();
    
    await prisma.oAuthKeys.create({
        data: {
            expires: now,
            userId: user.userId,
            id: keyOAuth
        }
    });

    cookies().set("@spacelabs/id", localAuthKey, {
        maxAge: 60*60*3,
        httpOnly: false
    })

    return new Response(JSON.stringify({
        keyOAuth
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

function readFileData(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if(err){
                reject("Read File Error");
            }
            resolve(data.toString());
        });
    });
}

function validateJWT(key: string): Promise<string>{
    return new Promise(async (resolve, reject) => {
        const fileData = await readFileData("src/keys/public.key");
        if(!fileData){
            return reject("Sign File Read Error");
        }
        try {
            const localAuth = jwt.verify(key, fileData) as IOAuthLocal;
            resolve(localAuth.userId);
        }catch(err){
            reject("Tempo de sessão expirado!")
        }
    });
  }