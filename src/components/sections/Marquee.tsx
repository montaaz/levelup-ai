const ITEMS = ["Websites that work", "AI videos that sell", "Automations that save time"];

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((row) => (
          <div className="marquee-item" key={row}>
            {ITEMS.map((item) => (
              <span key={item} className="marquee-pair">
                <span>{item}</span>
                <span className="marquee-star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
