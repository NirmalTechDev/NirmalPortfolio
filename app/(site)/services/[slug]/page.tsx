import { LandingRoute, landingMetadata } from "@/components/site/landing-route";
import { getPortfolio } from "@/lib/content/api";

export const dynamicParams = true;

export async function generateStaticParams() {
  const { site } = await getPortfolio();
  return site.services.pages.filter((p) => p.kind === "service" && p.isVisible !== false).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return landingMetadata(slug);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LandingRoute slug={slug} />;
}
