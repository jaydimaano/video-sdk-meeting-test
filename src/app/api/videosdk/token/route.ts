import { getVideoSdkToken } from "@/vendors/get-video-sdk-token";

export const dynamic = "force-dynamic";

export async function GET() {
  return getVideoSdkToken();
}
