import Button from "../components/Button";
import arrowRight from "../assets/arrow_right.svg";
import { Star } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const { status } = useAuth();

  const handleNavigate = () => {
    if (status) navigate("/userDashboard");
    else navigate("/signup");
  };

  const avatars = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    "https://randomuser.me/api/portraits/men/75.jpg",
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex flex-col items-center justify-center
      px-4 md:px-16 lg:px-24 xl:px-40 pt-28 pb-32 bg-canvas"
    >
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid opacity-[0.15]" />

      {/* Glow */}
      <div className="absolute top-20 w-[500px] h-[500px] bg-primary/20 blur-[140px] rounded-full" />

      {/* Trust pill */}
      <div className="relative z-10 flex items-center gap-4 bg-surface-1/80 backdrop-blur-md
        px-5 py-2.5 rounded-full border border-hairline">
        <div className="flex -space-x-2.5">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover border-2 border-surface-1"
            />
          ))}
        </div>
        <div>
          <div className="flex gap-0.5">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-xs font-medium text-ink-muted">
            Trusted by 10,000+ users
          </p>
        </div>
      </div>

      {/* Headline */}
      <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-semibold
        max-w-4xl text-center mt-12 leading-[1.05] tracking-[-0.03em] text-ink">
        Understand medical reports
        <span className="block bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
          with clinical-grade AI clarity
        </span>
      </h1>

      {/* Subtext */}
      <p className="relative z-10 max-w-2xl text-center text-base md:text-lg
        my-8 text-ink-muted leading-relaxed">
        LabLens analyzes lab and diagnostic reports using AI to surface
        critical values, flag abnormalities, and translate complex data
        into clear, human-readable insights.
      </p>

      {/* CTA */}
      <div className="relative z-10 flex items-center gap-4">
        <Button
          onClick={handleNavigate}
          className="text-base px-8 py-3.5 flex items-center gap-3"
        >
          Try live demo
          <img
            src={arrowRight}
            alt=""
            className="w-4 h-4"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Button>
        <Button
          variant="secondary"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-base px-8 py-3.5"
        >
          Learn more
        </Button>
      </div>
    </section>
  );
};

export default Hero;
