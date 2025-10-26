export default function Composer() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <input
        type="text"
        placeholder="What’s on your mind?"
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-500"
      />
    </div>
  );
}
