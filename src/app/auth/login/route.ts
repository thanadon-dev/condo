import { redirect } from "next/navigation";
import { googleConfig, newState } from "@/lib/auth";
import { absolute } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = googleConfig();
  if (!cfg) return new Response("oauth not configured", { status: 503 });

  const params = new URLSearchParams({
    client_id: cfg.client_id,
    redirect_uri: absolute("/auth/callback"),
    response_type: "code",
    scope: "openid email profile",
    state: newState(),
    access_type: "online",
    prompt: "select_account",
  });

  redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
