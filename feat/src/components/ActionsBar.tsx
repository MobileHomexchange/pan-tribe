export default function ActionsBar() {
  return (
    <div className="mt-3 flex flex-wrap gap-3 rounded-xl border bg-white p-3 text-sm shadow-sm">
      <button className="flex-1 rounded-lg border px-3 py-2 hover:bg-gray-50">
        🎥 Live Video
      </button>
      <button className="flex-1 rounded-lg border px-3 py-2 hover:bg-gray-50">
        🖼️ Photo/Video
      </button>
      <button className="flex-1 rounded-lg border px-3 py-2 hover:bg-gray-50">
        😊 Feeling/Activity
      </button>
    </div>
  );
}
