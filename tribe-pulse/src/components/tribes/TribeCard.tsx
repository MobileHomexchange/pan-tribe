/**
 * TribeCard Component
 * Displays a single tribe’s info in a card layout
 */
export default function TribeCard({ tribe }) {
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-1">{tribe.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">
        {tribe.description}
      </p>

      <div className="flex flex-wrap gap-1 mt-2">
        {tribe.subjects?.map((s, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
