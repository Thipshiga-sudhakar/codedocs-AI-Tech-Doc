import { useMemo } from "react";

const codeSnippets = ["const", "=>", "async", "return", "{}", "import", "class", "fn()", "</>", "export", "type", "||"];

const HeroParticles = () => {
  const particles = useMemo(
    () =>
      codeSnippets.map((s, i) => ({
        text: s,
        left: `${(i * 8.3) % 100}%`,
        top: `${(i * 17 + 5) % 90}%`,
        delay: `${i * 0.5}s`,
        duration: `${4 + (i % 3) * 2}s`,
        opacity: 0.08 + (i % 4) * 0.03,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute font-mono text-primary animate-float select-none"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            fontSize: `${10 + (i % 3) * 4}px`,
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
};

export default HeroParticles;
