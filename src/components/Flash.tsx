export default function Flash({
  error,
  ok,
}: {
  error?: string | null;
  ok?: string | null;
}) {
  if (!error && !ok) return null;
  return (
    <>
      {error && <p className="error-text">{error}</p>}
      {ok && <p className="ok-text">{ok}</p>}
    </>
  );
}