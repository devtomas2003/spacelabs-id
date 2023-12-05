import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import type { NextRequest } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    const authHeader = req.headers.get("Authorization");

    if(!authHeader){
        return new Response(JSON.stringify({
            message: "Cabeçalho Authorization não encontrado!"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
                "WWW-Authenticate": 'Basic realm="User - SpaceLabs Services"'
            },
        });
    }

    const encoded = authHeader.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [username, password] = decoded.split(":");
    
    if(username === "" || password === ""){
        return new Response(JSON.stringify({
            message: "Email e/ou password incorreto(s)!"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
                "WWW-Authenticate": 'Basic realm="User - SpaceLabs Services"'
            },
        });
    }

    const user = await prisma.users.findUnique({
        where: {
            email: username
        },
        select: {
            password: true,
            otpCode: true,
            userId: true
        }
    });

    if(!user){
        return new Response(JSON.stringify({
            message: "Email e/ou password incorreto(s)!"
        }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
                "WWW-Authenticate": 'Basic realm="User - SpaceLabs Services"'
            },
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return new Response(JSON.stringify({
            message: "Email e/ou password incorreto(s)!"
        }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
                "WWW-Authenticate": 'Basic realm="User - SpaceLabs Services"'
            },
        });
    }


    const signKey = fs.readFileSync('src/keys/private.key');

    const userAuth = jwt.sign({ userId: user.userId }, signKey, {
        expiresIn: '3h',
        algorithm: 'RS512'
    });

    return new Response(JSON.stringify({
        userAuth
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}