import { Link } from "react-router-dom";

// Catch-all route retains the brand and a clear way home.
export default function NotFound() {
  return (
    <main className="bg-bg text-ink flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-6">Кажется, идея свернула не туда</p>
      <h1 className="font-display tracking-display text-[120px] sm:text-[180px]">404</h1>
      <p className="mb-9 mt-5 text-xl text-muted">Такой страницы нет</p>
      <Link to="/" className="btn-primary bg-accent text-white text-[19px] font-display">
        На главную
      </Link>
    </main>
  );
}
