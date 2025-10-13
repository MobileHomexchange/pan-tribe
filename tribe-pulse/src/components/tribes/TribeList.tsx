import TribeCard from "./TribeCard";

/**
 * TribeList Component
 * Displays all tribes in a responsive grid.
 */
export default function TribeList({ tribes = [] }) {
  if (!tribes.length) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No tribes found. Try adjusting your filters or create one!
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tribes.map((t) => (
        <TribeCard key={t.id} tribe={t} />
      ))}
    </div>
  );
}
