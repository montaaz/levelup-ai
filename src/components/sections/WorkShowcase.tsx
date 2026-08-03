import VideoSlot from "@/components/media/VideoSlot";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

export default function WorkShowcase() {
  return (
    <section className="section section-vivid section-vivid-work" id="work" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <span className="section-kicker">What it can look like</span>
            <h2>One studio. Many ways to grow.</h2>
          </div>
          <p className="section-lead">
            From the first impression to the follow-up behind the scenes, we help your business feel more professional and more capable.
          </p>
        </Reveal>

        <div className="work-grid">
          <Reveal as="article">
            <GlassCard className="work-card" tilt={false}>
              <span className="work-tag">Website experience</span>
              <div className="website-showcase">
                <div className="website-window">
                  <div className="website-window-top"></div>
                  <div className="website-window-body">
                    <strong>SMALL BUSINESS / BIG PRESENCE</strong>
                    <h4>Turn your idea into a brand customers trust.</h4>
                    <div className="website-lines"><span></span><span></span><span></span></div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal as="article" delay={0.1}>
            <GlassCard className="work-card" tilt={false}>
              <span className="work-tag">AI product commercial</span>
              <VideoSlot
                className="video-showcase"
                src="/videos/product-commercial.mp4"
                fallback={
                  <div className="video-product">
                    YOUR<br />PRODUCT
                  </div>
                }
              />
            </GlassCard>
          </Reveal>

          <Reveal as="article" delay={0.18}>
            <GlassCard className="work-card" tilt={false}>
              <span className="work-tag">Smart automation</span>
              <div className="automation-showcase">
                <div className="automation-panel">
                  <small>YOUR BUSINESS WORKFLOW</small>
                  <div className="automation-row">
                    <span className="automation-node">Form</span><b>›</b>
                    <span className="automation-node">AI</span><b>›</b>
                    <span className="automation-node">Follow-up</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
