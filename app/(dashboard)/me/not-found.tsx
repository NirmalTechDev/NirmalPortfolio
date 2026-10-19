import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="adm-page adm-page--narrow">
      <div className="adm-empty">
        <p className="adm-empty__title">Nothing here</p>
        <p>This dashboard page doesn&apos;t exist.</p>
        <Link className="adm-btn" href="/me">
          Back to overview
        </Link>
      </div>
    </div>
  );
}
