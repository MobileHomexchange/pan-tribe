<div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 px-2 sm:px-4 md:px-6">
  {/* Main Feed Area */}
  <div className="lg:col-span-2 w-full">
    <MainFeed />

    {/* Mobile Sidebar (ads below feed) */}
    <div className="block lg:hidden mt-6 space-y-4">
      <RightSidebar />
    </div>

    {/* Floating Mobile Banner */}
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="mx-auto w-full max-w-md p-2">
        <a href="https://your-ad-link.com" target="_blank" rel="noopener noreferrer">
          <img src="/ads/mobile-banner.jpg" alt="Ad Banner" className="rounded-lg shadow-lg w-full object-cover" />
        </a>
      </div>
    </div>
  </div>

  {/* Desktop Sidebar */}
  <div className="hidden lg:block px-5">
    <RightSidebar />
  </div>
</div>;
