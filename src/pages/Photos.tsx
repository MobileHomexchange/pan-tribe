import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhotoGalleryModal, Photo } from "@/components/PhotoGalleryModal";
import { cn } from "@/lib/utils";

export default function Photos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Mock photo data
  const photos: Photo[] = [
    {
      id: "1",
      title: "Family Reunion in Lagos",
      description: "Amazing time with the extended family",
      imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
      uploadDate: "2024-01-15"
    },
    {
      id: "2", 
      title: "Traditional Wedding Ceremony",
      description: "Beautiful traditional ceremony in Abuja",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=600&fit=crop",
      uploadDate: "2024-02-20"
    },
    {
      id: "3",
      title: "Cultural Festival",
      description: "Celebrating our heritage at the annual festival",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      uploadDate: "2024-03-10"
    },
    {
      id: "4",
      title: "Business Conference",
      description: "Networking event in Accra",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      uploadDate: "2024-03-25"
    },
    {
      id: "5",
      title: "University Graduation",
      description: "Proud graduation day at University of Cape Town",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
      uploadDate: "2024-04-12"
    },
    {
      id: "6",
      title: "Community Outreach",
      description: "Volunteering in the local community",
      imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
      uploadDate: "2024-05-08"
    }
  ];

  const albums = [
    { id: "all", name: "All Photos", count: photos.length },
    { id: "family", name: "Family", count: 2 },
    { id: "events", name: "Events", count: 3 },
    { id: "professional", name: "Professional", count: 1 }
  ];

  const filteredPhotos = photos.filter(photo => 
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Photos</h1>
          <p className="text-muted-foreground">
            Share and explore moments from the diaspora community
          </p>
        </div>

        {/* Search and Albums */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button>
                <i className="fas fa-search mr-2"></i>
                Search
              </Button>
            </div>

            {/* Album Filters */}
            <div className="flex flex-wrap gap-2">
              {albums.map((album) => (
                <Button
                  key={album.id}
                  variant={selectedAlbum === album.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAlbum(selectedAlbum === album.id ? null : album.id)}
                  className="flex items-center gap-2"
                >
                  <i className="fas fa-folder"></i>
                  {album.name} ({album.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <Card 
              key={photo.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              onClick={() => handlePhotoClick(index)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <i className="fas fa-search-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <i className="fas fa-calendar"></i>
                    <span>{photo.uploadDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <Card>
            <CardContent className="p-16 text-center">
              <div className="text-6xl mb-6 text-muted-foreground">📷</div>
              <h3 className="text-xl font-medium mb-2">No photos found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search terms or browse all photos"
                  : "Start sharing your moments with the community!"
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery Modal */}
        <PhotoGalleryModal
          photos={filteredPhotos}
          initialIndex={selectedPhotoIndex}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      </div>
    </Layout>
  );
}