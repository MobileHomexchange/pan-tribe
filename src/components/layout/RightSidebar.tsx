// RightSidebar.tsx - For Google Ads and controlled ads
export function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* Sponsored/Controlled Ads Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900">Sponsored Ads</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
            <div className="text-xs text-blue-600 font-medium mb-1">Sponsored</div>
            <h4 className="font-semibold text-sm mb-1">Your Ad Campaign</h4>
            <p className="text-xs text-gray-600 mb-2">Reach your target audience with Tribe Pulse</p>
            <div className="text-xs text-gray-400">tribepulse.com</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
            <div className="text-xs text-blue-600 font-medium mb-1">Promoted</div>
            <h4 className="font-semibold text-sm mb-1">Boost Your Posts</h4>
            <p className="text-xs text-gray-600 mb-2">Get more visibility for your content</p>
            <div className="text-xs text-gray-400">tribepulse.com/ads</div>
          </div>
        </div>
      </div>

      {/* Google Ads Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900">Advertisement</h3>
        <div className="bg-gray-100 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center">
          <div className="text-gray-500">
            <p className="text-sm mb-2">Google Ads Space</p>
            <p className="text-xs">300 x 600</p>
            <p className="text-xs text-gray-400 mt-1">Ad will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Additional Ad Space */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="bg-gray-100 rounded-lg p-4 text-center min-h-[250px] flex items-center justify-center">
          <div className="text-gray-500">
            <p className="text-sm mb-2">Additional Ad Space</p>
            <p className="text-xs">300 x 250</p>
            <p className="text-xs text-gray-400 mt-1">Your ad content here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
