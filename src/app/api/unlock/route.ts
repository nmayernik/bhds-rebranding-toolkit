import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "bhds_showcase_auth";
const SHARED_SECRET = process.env.SHOWCASE_PASSWORD ?? "";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/") || "/";

  const origin = req.nextUrl.origin;

  if (!SHARED_SECRET || password !== SHARED_SECRET) {
    const failUrl = new URL("/unlock", origin);
    failUrl.searchParams.set("error", "1");
    if (next && next !== "/") failUrl.searchParams.set("next", next);
    return NextResponse.redirect(failUrl, { status: 303 });
  }

  const safeNext = next.startsWith("/") ? next : "/";
  const res = NextResponse.redirect(new URL(safeNext, origin), { status: 303 });
  res.cookies.set(COOKIE_NAME, SHARED_SECRET, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
