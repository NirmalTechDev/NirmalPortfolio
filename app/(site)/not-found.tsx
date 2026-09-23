import Link from "next/link";

export default function NotFound() {
  return (
    <section className="frame not-found">
      <p className="meta signal">404</p>
      <h1 className="h1" style={{ margin: "var(--s-4) 0" }}>This page does not exist.</h1>
      <Link className="tlink" href="/work">
        See the work instead <span className="arr" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
