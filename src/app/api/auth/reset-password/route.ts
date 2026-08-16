import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

import { adminDb, adminAuth } from "@/lib/firebase/admin";

const redis = Redis.fromEnv();

const RESET_IP_RATE_LIMIT = 10;
const RESET_IP_RATE_WINDOW_SECONDS = 15 * 60;

const RESET_EMAIL_RATE_LIMIT = 5;
const RESET_EMAIL_RATE_WINDOW_SECONDS = 15 * 60;

const EMAIL_MAX_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;

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
      !("newPassword" in body) ||
      typeof body.email !== "string" ||
      typeof body.newPassword !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Dados inválidos.",
        },
        {
          status: 400,
        },
      );
    }

    const email = body.email.trim().toLowerCase();
    const newPassword = body.newPassword;

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

    if (!newPassword) {
      return NextResponse.json(
        {
          error: "Nova senha é obrigatória.",
        },
        {
          status: 400,
        },
      );
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: `A senha deve possuir pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        },
        {
          status: 400,
        },
      );
    }

    if (newPassword.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: `A senha deve possuir no máximo ${MAX_PASSWORD_LENGTH} caracteres.`,
        },
        {
          status: 400,
        },
      );
    }

    const clientIp = getClientIp(request);

    const emailHash = hashValue(email);
    const ipHash = hashValue(clientIp);

    const ipRateLimitKey = `password-reset:complete:ip:${ipHash}`;

    const ipAttempts = await redis.incr(ipRateLimitKey);

    if (ipAttempts === 1) {
      await redis.expire(ipRateLimitKey, RESET_IP_RATE_WINDOW_SECONDS);
    }

    if (ipAttempts > RESET_IP_RATE_LIMIT) {
      return NextResponse.json(
        {
          error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        },
        {
          status: 429,
        },
      );
    }

    const emailRateLimitKey = `password-reset:complete:email:${emailHash}`;

    const emailAttempts = await redis.incr(emailRateLimitKey);

    if (emailAttempts === 1) {
      await redis.expire(emailRateLimitKey, RESET_EMAIL_RATE_WINDOW_SECONDS);
    }

    if (emailAttempts > RESET_EMAIL_RATE_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Muitas tentativas para este e-mail. Aguarde alguns minutos e tente novamente.",
        },
        {
          status: 429,
        },
      );
    }

    const resetRef = adminDb.collection("passwordResetCodes").doc(emailHash);

    const resetSnap = await resetRef.get();

    if (!resetSnap.exists) {
      return NextResponse.json(
        {
          error: "Solicitação de recuperação inválida ou expirada.",
        },
        {
          status: 400,
        },
      );
    }

    const resetData = resetSnap.data();

    if (!resetData) {
      return NextResponse.json(
        {
          error: "Solicitação de recuperação inválida ou expirada.",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof resetData.email !== "string" || resetData.email !== email) {
      return NextResponse.json(
        {
          error: "Solicitação de recuperação inválida.",
        },
        {
          status: 400,
        },
      );
    }

    if (resetData.verified !== true) {
      return NextResponse.json(
        {
          error: "O código ainda não foi verificado.",
        },
        {
          status: 400,
        },
      );
    }

    const expiresAt = resetData.expiresAt as Timestamp | undefined;

    if (!expiresAt || expiresAt.toMillis() < Date.now()) {
      await resetRef.delete();

      return NextResponse.json(
        {
          error:
            "A solicitação de recuperação expirou. Solicite um novo código.",
        },
        {
          status: 400,
        },
      );
    }

    if (!resetData.verifiedAt) {
      return NextResponse.json(
        {
          error: "A verificação da solicitação é inválida.",
        },
        {
          status: 400,
        },
      );
    }

    let user;

    try {
      user = await adminAuth.getUserByEmail(email);
    } catch {
      return NextResponse.json(
        {
          error: "Não foi possível concluir a recuperação.",
        },
        {
          status: 400,
        },
      );
    }

    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });

    await resetRef.delete();

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);

    return NextResponse.json(
      {
        error: "Não foi possível redefinir a senha.",
      },
      {
        status: 500,
      },
    );
  }
}
