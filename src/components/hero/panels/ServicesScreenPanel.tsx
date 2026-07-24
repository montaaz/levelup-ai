/**
 * Second preview panel: a compact "what we do" card row, echoing the real
 * Services section's three offerings at laptop scale. Distinct markup from
 * Services.tsx — no VideoSlot, no GlassCard, no Reveal — just three simple
 * cards, legible at a glance mid-pan.
 */
const SERVICES_PREVIEW = [
  { label: "Websites", desc: "Launch fast, look sharp" },
  { label: "AI Video", desc: "Commercials that convert" },
  { label: "Automation", desc: "Leads followed up instantly" },
];

export default function ServicesScreenPanel() {
  return (
    <div className="screen-panel">
      <span className="screen-panel-kicker">What we do</span>
      <h2 className="screen-panel-title">Three ways to level up.</h2>
      <div className="screen-panel-cards">
        {SERVICES_PREVIEW.map((service) => (
          <div className="screen-panel-card" key={service.label}>
            <strong>{service.label}</strong>
            <span>{service.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
