export default function Feed() {
  const posts = [
    { id: 1, author: "Tribe Pulse", text: "Welcome to the new community feed!" },
    { id: 2, author: "Anonymous", text: "Just testing out the new layout 👀" },
  ];

  return (
    <div className="mt-4 space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="font-semibold">{post.author}</div>
          <p className="text-gray-700 mt-1">{post.text}</p>
        </div>
      ))}
    </div>
  );
}
