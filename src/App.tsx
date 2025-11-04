// In your App.tsx - ensure these routes exist
<Routes>
  {/* Landing page with blog layout */}
  <Route path="/" element={<Index />} />
  
  {/* App pages with your existing Layout component */}
  <Route path="/feed" element={<Home />} />
  <Route path="/home" element={<Home />} />
  <Route path="/my-tribe" element={<MyTribe />} />
  <Route path="/friends" element={<Friends />} />
  {/* ... other app routes */}
  
  {/* Admin routes with AdminLayout */}
  <Route path="/admin" element={<AdminLayout />}>
    {/* ... admin sub-routes */}
  </Route>
</Routes>
