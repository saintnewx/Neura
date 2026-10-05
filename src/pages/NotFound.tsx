import { Link } from "react-router-dom";

// Catch-all route retains the brand and a clear way home.
export default function NotFound() {
  return (
    <main className="hero-glow flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-6">Кажется, идея свернула не туда</p>
      <h1 className="gradient-text text-[120px] sm:text-[180px]">404</h1>
      <p className="mb-9 mt-5 text-xl text-muted">Такой страницы нет</p>
      <Link to="/" className="btn-primary">
        На главную
      </Link>
    </main>
  );
}
