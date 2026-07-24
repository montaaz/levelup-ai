/**
 * Third preview panel: a compact "see it in action" glimpse, echoing the
 * real WorkShowcase section's three showcase tags at laptop scale.
 */
const WORK_PREVIEW = ["Website experience", "AI product commercial", "Smart automation"];

export default function WorkShowcaseScreenPanel() {
  return (
    <div className="screen-panel">
      <span className="screen-panel-kicker">What it looks like</span>
      <h2 className="screen-panel-title">One studio. Many ways to grow.</h2>
      <div className="screen-panel-tags">
        {WORK_PREVIEW.map((tag) => (
          <span className="screen-panel-tag" key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
