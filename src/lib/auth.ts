import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "nikou-super-secret-key-2024";
  return new TextEncoder().encode(secret);
};

// ساخت توکن
export async function signToken(payload: { userId: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // اعتبار ۷ روزه
    .sign(getJwtSecretKey());
}

// تایید توکن
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}