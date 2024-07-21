import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const response = await fetch(`${process.env.MODEL_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const res = await response.json();
        return NextResponse.json({
            success: true,
            isFraud: res.prediction
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            msg: "Internal Server Error"
        })
    }
    
}