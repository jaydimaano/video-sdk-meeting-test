import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function getVideoSdkToken() {
  const apikey = process.env.NEXT_PRIVATE_VIDEOSDK_API_KEY ?? "";
  const secretKey: Secret = process.env.NEXT_PRIVATE_VIDEOSDK_SECRET_KEY ?? "";

  const options: SignOptions = {
    expiresIn: "120m",
    algorithm: "HS256",
  };

  const payload = {
    apikey,
    permissions: [`allow_join`], // `ask_join` || `allow_mod`
    // version: 2, //OPTIONAL
    // roomId: `2kyv-gzay-64pg`, //OPTIONAL
    // participantId: `lxvdplwt`, //OPTIONAL
    // roles: ["crawler", "rtc"], //OPTIONAL
  };

  try {
    const token = jwt.sign(payload, secretKey, options);

    return NextResponse.json(token);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
