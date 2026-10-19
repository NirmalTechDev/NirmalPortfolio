export default function Loading() {
  return (
    <div className="adm-page" aria-busy="true" aria-label="Loading">
      <div className="adm-skel" style={{ height: 52, width: "38%", marginBottom: 24 }} />
      <div className="adm-skel" style={{ height: 120, marginBottom: 16 }} />
      <div className="adm-skel" style={{ height: 240 }} />
    </div>
  );
}
