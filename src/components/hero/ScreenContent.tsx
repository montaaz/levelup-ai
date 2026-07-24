/**
 * The laptop screen shows a distinct mini client-website mockup — not a
 * restatement of the hero headline (already huge, right above) or the
 * automation phone (already shows the lead-flow live, right beside it).
 * This is "what a site we'd build for you looks like."
 */
export default function ScreenContent() {
  return (
    <div className="screen-content">
      <div className="screen-mini-nav">
        <span className="screen-mini-logo">NORTH / STUDIO</span>
        <span className="screen-mini-links">Services&nbsp;&nbsp;Work&nbsp;&nbsp;Contact</span>
      </div>
      <h2 className="screen-slide-title">A sharper website for your next chapter.</h2>
      <p className="screen-slide-copy">Clear strategy, beautiful design, built to turn curious visitors into confident customers.</p>
      <span className="screen-mini-button">See the work →</span>
    </div>
  );
}
