import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import HeroPreview from "./HeroPreview";

// A real product destination and a local, clearly labelled example.
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="mn-hero">
      <div className="mn-container mn-hero-grid">
        <div className="mn-hero-copy">
          <p className="mn-label">Neura / AI Workspace</p>
          <h1 id="hero-title">От идеи до готового текста.</h1>
          <p className="mn-hero-description">
            Создавайте посты, рекламные тексты и контент для бизнеса с помощью AI.
            Меньше рутины — больше пространства для идей.
          </p>
          <div className="mn-hero-actions">
            <Link to="/app" className="mn-button mn-button-primary">Начать создавать <ArrowRight aria-hidden="true" /></Link>
            <a href="#demo" className="mn-button"><Play size={16} aria-hidden="true" />Посмотреть демо</a>
          </div>
          <p className="mn-hero-note">5 генераций в день без регистрации. Без карты.</p>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}
