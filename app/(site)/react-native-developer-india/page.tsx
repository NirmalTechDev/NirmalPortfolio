import { LandingRoute, landingMetadata } from "@/components/site/landing-route";

const SLUG = "react-native-developer-india";

export const generateMetadata = () => landingMetadata(SLUG, "location");

export default function Page() {
  return <LandingRoute slug={SLUG} kind="location" />;
}
