import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "bhds_showcase_auth";
const SHARED_SECRET = process.env.SHOWCASE_PASSWORD ?? "";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/unlock") || pathname.startsWith("/_next") || pathname.startsWith("/api/unlock")) {
    return NextResponse.next();
  }
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie && cookie === SHARED_SECRET) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
