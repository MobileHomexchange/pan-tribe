type Props = { label: string; value: string | number };

export default function Kpi({ label, value }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
