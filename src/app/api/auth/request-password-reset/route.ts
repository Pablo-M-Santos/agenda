import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";
import crypto from "crypto";
import { Redis } from "@upstash/redis";

import { adminDb } from "@/lib/firebase/admin";

const redis = Redis.fromEnv();

const CODE_EXPIRATION_MINUTES = 10;

const IP_RATE_LIMIT = 5;
const IP_RATE_WINDOW_SECONDS = 15 * 60;

const EMAIL_RATE_LIMIT = 3;
const EMAIL_RATE_WINDOW_SECONDS = 15 * 60;

const EMAIL_MAX_LENGTH = 254;

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isValidEmail(email: string) {
  if (!email || email.length > EMAIL_MAX_LENGTH) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Requisição inválida.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      typeof body.email !== "string"
    ) {
      return NextResponse.json(
        {
          error: "E-mail é obrigatório.",
        },
        {
          status: 400,
        },
      );
    }

    const email = body.email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Informe um e-mail válido.",
        },
        {
          status: 400,
        },
      );
    }

    const clientIp = getClientIp(request);

    const emailHash = hashValue(email);
    const ipHash = hashValue(clientIp);

    const ipRateLimitKey = `password-reset:request:ip:${ipHash}`;

    const ipAttempts = await redis.incr(ipRateLimitKey);

    if (ipAttempts === 1) {
      await redis.expire(ipRateLimitKey, IP_RATE_WINDOW_SECONDS);
    }

    if (ipAttempts > IP_RATE_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Muitas solicitações. Aguarde alguns minutos e tente novamente.",
        },
        {
          status: 429,
        },
      );
    }

    const emailRateLimitKey = `password-reset:request:email:${emailHash}`;

    const emailAttempts = await redis.incr(emailRateLimitKey);

    if (emailAttempts === 1) {
      await redis.expire(emailRateLimitKey, EMAIL_RATE_WINDOW_SECONDS);
    }

    if (emailAttempts > EMAIL_RATE_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Muitas solicitações para este e-mail. Aguarde alguns minutos e tente novamente.",
        },
        {
          status: 429,
        },
      );
    }

    const code = generateCode();

    const codeHash = hashValue(code);

    const requestId = crypto.randomUUID();

    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000),
    );

    await adminDb.collection("passwordResetCodes").doc(emailHash).set({
      email,
      codeHash,
      expiresAt,
      attempts: 0,
      verified: false,
      requestId,
      createdAt: FieldValue.serverTimestamp(),
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM;

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY não configurada.");
    }

    if (!resendFrom) {
      throw new Error("RESEND_FROM não configurado.");
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: resendFrom,
      to: email,
      subject: "Código para redefinir sua senha",
      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background: #05070A;
          font-family: Arial, sans-serif;
          color: #ffffff;
        ">
          <div style="
            max-width: 480px;
            margin: 0 auto;
            padding: 32px;
            background: #0D1117;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
          ">
            <h1 style="
              margin: 0 0 8px;
              font-size: 24px;
            ">
              AGENDA
            </h1>

            <p style="
              margin: 0 0 28px;
              color: #94a3b8;
            ">
              Redefinição de senha
            </p>

            <p style="
              color: #cbd5e1;
              line-height: 1.6;
            ">
              Recebemos uma solicitação para redefinir a senha
              da sua conta.
            </p>

            <p style="
              margin-top: 24px;
              color: #cbd5e1;
            ">
              Seu código de verificação é:
            </p>

            <div style="
              margin: 20px 0;
              padding: 20px;
              text-align: center;
              background: #080B10;
              border: 1px solid rgba(59,130,246,0.25);
              border-radius: 12px;
            ">
              <span style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 10px;
                color: #60a5fa;
              ">
                ${code}
              </span>
            </div>

            <p style="
              color: #64748b;
              font-size: 13px;
              line-height: 1.6;
            ">
              Este código é válido por ${CODE_EXPIRATION_MINUTES} minutos.
            </p>

            <p style="
              color: #64748b;
              font-size: 13px;
              line-height: 1.6;
            ">
              Se você não solicitou essa alteração,
              ignore este e-mail.
            </p>

            <div style="
              margin-top: 28px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.08);
            ">
              <p style="
                margin: 0;
                color: #475569;
                font-size: 12px;
              ">
                AGENDA · Controle de atendimentos
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Erro ao enviar e-mail de recuperação.");

      return NextResponse.json(
        {
          error: "Não foi possível enviar o e-mail.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Se o e-mail estiver cadastrado, você receberá um código de recuperação.",
    });
  } catch (error) {
    console.error("Erro na solicitação de recuperação de senha:", error);

    return NextResponse.json(
      {
        error: "Não foi possível processar a solicitação.",
      },
      {
        status: 500,
      },
    );
  }
}
