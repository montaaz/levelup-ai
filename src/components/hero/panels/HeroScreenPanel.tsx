/**
 * First preview panel: a compact mini-website mockup — "what a site we'd
 * build for you looks like." Plain static markup, no video/GSAP/Reveal —
 * cheap to render at laptop scale and legible even mid-pan.
 */
export default function HeroScreenPanel() {
  return (
    <div className="screen-panel">
      <div className="screen-mini-nav">
        <span className="screen-mini-logo">NORTH / STUDIO</span>
        <span className="screen-mini-links">Services&nbsp;&nbsp;Work&nbsp;&nbsp;Contact</span>
      </div>
      <h2 className="screen-panel-title">A sharper website for your next chapter.</h2>
      <p className="screen-panel-copy">Clear strategy, beautiful design, built to turn curious visitors into confident customers.</p>
      <span className="screen-mini-button">See the work →</span>
    </div>
  );
}
