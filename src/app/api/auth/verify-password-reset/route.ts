import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import crypto from "crypto";
import { Redis } from "@upstash/redis";

import { adminDb } from "@/lib/firebase/admin";

const redis = Redis.fromEnv();

const MAX_ATTEMPTS = 5;

const VERIFY_IP_RATE_LIMIT = 20;
const VERIFY_IP_RATE_WINDOW_SECONDS = 15 * 60;

const VERIFY_EMAIL_RATE_LIMIT = 10;
const VERIFY_EMAIL_RATE_WINDOW_SECONDS = 15 * 60;

const EMAIL_MAX_LENGTH = 254;

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

function safeCompare(a: string, b: string) {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
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
      !("code" in body) ||
      typeof body.email !== "string" ||
      typeof body.code !== "string"
    ) {
      return NextResponse.json(
        {
          error: "E-mail e código são obrigatórios.",
        },
        {
          status: 400,
        },
      );
    }

    const email = body.email.trim().toLowerCase();
    const code = body.code.trim();

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

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          error: "O código deve possuir 6 dígitos.",
        },
        {
          status: 400,
        },
      );
    }

    const clientIp = getClientIp(request);

    const emailHash = hashValue(email);
    const ipHash = hashValue(clientIp);

    const ipRateLimitKey = `password-reset:verify:ip:${ipHash}`;

    const ipAttempts = await redis.incr(ipRateLimitKey);

    if (ipAttempts === 1) {
      await redis.expire(ipRateLimitKey, VERIFY_IP_RATE_WINDOW_SECONDS);
    }

    if (ipAttempts > VERIFY_IP_RATE_LIMIT) {
      return NextResponse.json(
        {
          error: "Muitas tentativas de verificação. Aguarde alguns minutos.",
        },
        {
          status: 429,
        },
      );
    }

    const emailRateLimitKey = `password-reset:verify:email:${emailHash}`;

    const emailAttempts = await redis.incr(emailRateLimitKey);

    if (emailAttempts === 1) {
      await redis.expire(emailRateLimitKey, VERIFY_EMAIL_RATE_WINDOW_SECONDS);
    }

    if (emailAttempts > VERIFY_EMAIL_RATE_LIMIT) {
      return NextResponse.json(
        {
          error: "Muitas tentativas de verificação. Aguarde alguns minutos.",
        },
        {
          status: 429,
        },
      );
    }

    const resetRef = adminDb.collection("passwordResetCodes").doc(emailHash);

    const resetSnapshot = await resetRef.get();

    if (!resetSnapshot.exists) {
      return NextResponse.json(
        {
          error: "Código inválido ou expirado.",
        },
        {
          status: 400,
        },
      );
    }

    const resetData = resetSnapshot.data();

    if (!resetData) {
      return NextResponse.json(
        {
          error: "Código inválido ou expirado.",
        },
        {
          status: 400,
        },
      );
    }

    if (resetData.verified === true) {
      return NextResponse.json(
        {
          error: "Este código já foi utilizado.",
        },
        {
          status: 400,
        },
      );
    }

    const attempts =
      typeof resetData.attempts === "number" ? resetData.attempts : 0;

    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error:
            "Número máximo de tentativas excedido. Solicite um novo código.",
        },
        {
          status: 429,
        },
      );
    }

    const expiresAt = resetData.expiresAt;

    if (
      !(expiresAt instanceof Timestamp) ||
      expiresAt.toMillis() <= Date.now()
    ) {
      await resetRef.delete();

      return NextResponse.json(
        {
          error: "Este código expirou. Solicite um novo código.",
        },
        {
          status: 400,
        },
      );
    }

    const providedCodeHash = hashValue(code);

    if (
      typeof resetData.codeHash !== "string" ||
      !safeCompare(resetData.codeHash, providedCodeHash)
    ) {
      const newAttempts = attempts + 1;

      await resetRef.update({
        attempts: newAttempts,
      });

      const remainingAttempts = MAX_ATTEMPTS - newAttempts;

      return NextResponse.json(
        {
          error:
            remainingAttempts > 0
              ? `Código incorreto. Você ainda possui ${remainingAttempts} tentativa(s).`
              : "Número máximo de tentativas excedido. Solicite um novo código.",
        },
        {
          status: remainingAttempts > 0 ? 400 : 429,
        },
      );
    }

    await resetRef.update({
      verified: true,
      verifiedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao verificar código de recuperação:", error);

    return NextResponse.json(
      {
        error: "Não foi possível verificar o código.",
      },
      {
        status: 500,
      },
    );
  }
}
