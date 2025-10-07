export function RightSidebar() {
  return (
    <aside className="space-y-6">
      {/* Google Ad Banner */}
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

      {/* Custom or Personal Banner */}
      <a href="https://your-promo-link.com" target="_blank" rel="noopener noreferrer">
        <img src="/ads/promo-banner.jpg" alt="Promotion" className="w-full rounded-lg shadow-lg object-cover" />
      </a>
    </aside>
  );
}
