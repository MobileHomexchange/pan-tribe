import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, User, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlogDetailModal } from "@/components/blog/BlogDetailModal";
import { BlogSubmissionModal } from "@/components/blog/BlogSubmissionModal";

// Mock data for approved blogs with full content
const mockBlogs = [
  {
    id: "1",
    title: "The Future of African Tech Innovation",
    excerpt: "Exploring the growing tech ecosystem across African countries and its impact on global innovation...",
    content: `The African tech ecosystem is experiencing unprecedented growth, with innovation hubs emerging across the continent from Lagos to Nairobi, Cape Town to Cairo. This technological renaissance is not just changing how Africans interact with technology, but is also positioning the continent as a significant player in the global digital economy.

In recent years, we've witnessed the rise of fintech solutions like M-Pesa in Kenya, which revolutionized mobile banking not just in Africa but globally. Similarly, companies like Flutterwave and Paystack have simplified online payments, enabling millions of businesses to participate in the digital economy.

The diaspora plays a crucial role in this transformation. African tech professionals working in Silicon Valley, London, and other global tech hubs are increasingly investing their expertise and capital back into African startups. This reverse brain drain is creating a powerful network of knowledge exchange and investment.

Looking ahead, artificial intelligence, blockchain technology, and renewable energy solutions developed by African innovators are set to address some of the continent's most pressing challenges. From precision agriculture apps that help smallholder farmers maximize yields to blockchain-based identity solutions for the unbanked, African tech is solving African problems with global implications.

The future is bright for African tech innovation, and the diaspora community will continue to be instrumental in this transformation.`,
    author: "Amara Okafor",
    category: "Technology",
    publishDate: "2024-03-10",
    readTime: "5 min read",
    featured_image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    watermark: "TRIBE PULSE"
  },
  {
    id: "2", 
    title: "African Art in the Digital Age",
    excerpt: "How contemporary African artists are embracing digital platforms to showcase their work globally...",
    content: `The digital revolution has opened unprecedented opportunities for African artists to showcase their work to global audiences. From digital galleries to NFT marketplaces, technology is democratizing access to the global art market and enabling African creators to tell their stories on their own terms.

Social media platforms like Instagram and TikTok have become virtual galleries where artists can build followings, engage with collectors, and sell their work directly. This disintermediation of traditional gallery systems has been particularly beneficial for emerging artists who might not have had access to conventional art world networks.

Virtual reality and augmented reality technologies are also creating new mediums for artistic expression. African artists are pioneering innovative uses of these technologies to create immersive experiences that transport viewers into African narratives and landscapes.

The rise of digital art and NFTs has sparked both excitement and debate within the African art community. While some see it as a new frontier for monetizing digital creativity, others question the environmental impact and accessibility of these technologies.

Despite these challenges, the digital age represents a golden opportunity for African art to reach its rightful place on the global stage. As technology continues to evolve, we can expect to see even more innovative ways for African artists to share their vision with the world.`,
    author: "Kwame Asante",
    category: "Arts & Culture",
    publishDate: "2024-03-08",
    readTime: "7 min read",
    featured_image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop",
    watermark: "TRIBE PULSE"
  },
  {
    id: "3",
    title: "Building Sustainable Communities",
    excerpt: "Lessons from successful community-driven initiatives across the African diaspora...",
    content: `Sustainable community building is at the heart of the African diaspora experience. Across the globe, African communities have developed innovative models for supporting one another, preserving culture, and creating economic opportunities that benefit both diaspora communities and the continent.

One of the most successful models has been the development of cultural centers and community hubs. These spaces serve multiple functions: they're venues for cultural events, educational programs, business networking, and social support. Cities like London, Toronto, and Atlanta have seen remarkable success with these community-driven initiatives.

Economic empowerment through community-led investment funds has also gained traction. Groups like the African Diaspora Investment Initiative are pooling resources to fund businesses both in diaspora communities and across Africa. This model creates a virtuous cycle of wealth creation and cultural connection.

Digital platforms are increasingly playing a role in community building. Online networks allow diaspora communities to maintain connections across geographical boundaries, share opportunities, and organize support for members facing challenges.

The key lessons from successful initiatives include the importance of inclusive leadership, clear communication, and programs that address both immediate needs and long-term sustainability. Most importantly, successful communities remember that building for today while planning for tomorrow ensures that future generations can benefit from the foundations we lay today.`,
    author: "Fatima Hassan",
    category: "Community",
    publishDate: "2024-03-05",
    readTime: "6 min read",
    featured_image: "https://images.unsplash.com/photo-1559027006-448665bd7c7f?w=800&h=400&fit=crop",
    watermark: "TRIBE PULSE"
  }
];

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState<typeof mockBlogs[0] | null>(null);
  const [blogDetailOpen, setBlogDetailOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "Technology", "Arts & Culture", "Community", "Business", "Health"];

  const handleReadMore = (blog: typeof mockBlogs[0]) => {
    setSelectedBlog(blog);
    setBlogDetailOpen(true);
  };

  const handleSubmitBlog = () => {
    setSubmissionModalOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">TribalPulse Blogs</h1>
              <p className="text-muted-foreground mt-2">
                Discover insights and stories from the African diaspora community
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmitBlog}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit Blog
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Blog */}
          {filteredBlogs.length > 0 && (
            <Card className="mb-8 overflow-hidden">
              <div className="relative">
                <img 
                  src={filteredBlogs[0].featured_image} 
                  alt={filteredBlogs[0].title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  {filteredBlogs[0].watermark}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{filteredBlogs[0].category}</Badge>
                  <Badge variant="outline">Featured</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-3 line-clamp-2">{filteredBlogs[0].title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">{filteredBlogs[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {filteredBlogs[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(filteredBlogs[0].publishDate).toLocaleDateString()}
                    </div>
                    <span>{filteredBlogs[0].readTime}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleReadMore(filteredBlogs[0])}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.slice(1).map((blog) => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                    {blog.watermark}
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">{blog.category}</Badge>
                  <h3 className="font-bold mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author}
                    </div>
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.publishDate).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleReadMore(blog)}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or category filter
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Footer watermark */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Powered by{" "}
                <a 
                  href="/" 
                  className="font-semibold text-primary hover:underline"
                >
                  TRIBE PULSE
                </a>
                {" "}• Connecting the African Diaspora
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        <BlogDetailModal 
          blog={selectedBlog}
          open={blogDetailOpen}
          onOpenChange={setBlogDetailOpen}
        />
        
        <BlogSubmissionModal 
          open={submissionModalOpen}
          onOpenChange={setSubmissionModalOpen}
        />
      </div>
    </Layout>
  );
}