export function RightSidebar() {
  return (
    <div className="space-y-6">
      {/* Sponsored */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Sponsored</h3>
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img src="/ads/ad1.jpg" alt="Ad" className="w-full" />
            <div className="p-2 text-sm text-gray-600">Built for Millions of Lines of Code — Zencoder.ai</div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img src="/ads/ad2.jpg" alt="Ad" className="w-full" />
            <div className="p-2 text-sm text-gray-600">Get started with Claude Code — www.anthropic.com</div>
          </div>
        </div>
      </div>

      {/* Tribal Ties (People You May Know) */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Tribal Ties</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-3">
            <img src="/avatars/avatar1.jpg" className="w-8 h-8 rounded-full" />
            <span className="text-sm">Aisha Thompson</span>
          </li>
          <li className="flex items-center gap-3">
            <img src="/avatars/avatar2.jpg" className="w-8 h-8 rounded-full" />
            <span className="text-sm">Kwame Mensah</span>
          </li>
          <li className="flex items-center gap-3">
            <img src="/avatars/avatar3.jpg" className="w-8 h-8 rounded-full" />
            <span className="text-sm">Nia Okafor</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
