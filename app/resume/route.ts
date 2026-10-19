import { NextResponse } from "next/server";
import { getPortfolio } from "@/lib/content/api";

/** Stable résumé link: redirects to whichever résumé is active in the dashboard. */
export async function GET(request: Request) {
  const { resume } = await getPortfolio();
  const target = resume?.fileUrl || "/Nirmal-ranpariya-resume.pdf";
  return NextResponse.redirect(new URL(target, request.url), 307);
}
