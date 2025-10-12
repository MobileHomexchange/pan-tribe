import SmartCreator from "@/components/SmartCreator";

export default function Feed() {
  return (
    <TribeLayout active="Feed">
      <div className="flex justify-end mb-4">
        <a href="/create" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          + Create Post
        </a>
      </div>
      {/* Optionally, you can render the SmartCreator inline here */}
      {/* <SmartCreator /> */}
    </TribeLayout>
  );
}
