"use client";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="adm-page adm-page--narrow">
      <div className="adm-empty">
        <p className="adm-empty__title">This page hit a problem</p>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button type="button" className="adm-btn adm-btn--primary" onClick={reset}>
          Reload this page
        </button>
      </div>
    </div>
  );
}
