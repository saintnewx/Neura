// Three lines represent the pending generation, with an accessible status.
export default function Skeleton() {
  return (
    <div role="status" aria-label="Генерируем текст" className="space-y-4 py-6">
      <span className="sr-only">Генерируем текст…</span>
      <div className="h-4 w-full animate-pulse rounded bg-line" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-line" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
    </div>
  );
}
