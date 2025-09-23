import React, { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Share2, MapPin, Plus, Crown, ChevronDown, Store, Filter } from "lucide-react";
import { ProductDetailModal } from "@/components/marketplace/ProductDetailModal";
import { useToast } from "@/hooks/use-toast";

interface AdBanner {
  isActive: boolean;
  content: string;
  clicks?: number;
  uniqueClicks?: Record<string, any>;
}

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  seller: {
    name: string;
    avatar: string;
  };
  image: string;
  badge?: string;
  isFeatured?: boolean;
}

const Marketplace = () => {
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [adBanner, setAdBanner] = useState<AdBanner>({ isActive: false, content: "" });
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const products: Product[] = [
    {
      id: "1",
      title: "Designer Sneakers - Like New",
      price: 120,
      location: "Accra, Ghana",
      seller: { name: "Kwame", avatar: "KA" },
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      badge: "Featured",
      isFeatured: true
    },
    {
      id: "2",
      title: "Handmade African Print Dress",
      price: 85,
      location: "Lagos, Nigeria",
      seller: { name: "Amina", avatar: "AD" },
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "3",
      title: "Wireless Headphones - Black",
      price: 45,
      location: "Nairobi, Kenya",
      seller: { name: "Thabo", avatar: "TJ" },
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "4",
      title: "Smart Watch - Latest Model",
      price: 250,
      location: "Accra, Ghana",
      seller: { name: "Nia", avatar: "NM" },
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "5",
      title: "Limited Edition Sneakers",
      price: 75,
      location: "Johannesburg, SA",
      seller: { name: "Elias", avatar: "ES" },
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "6",
      title: "Handcrafted Leather Bag",
      price: 35,
      location: "Dakar, Senegal",
      seller: { name: "Fatou", avatar: "FD" },
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      badge: "Free Shipping"
    }
  ];

  const toggleSave = (productId: string) => {
    setSavedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast({
          title: "Removed from saved",
          description: "Item removed from your saved listings"
        });
      } else {
        newSet.add(productId);
        toast({
          title: "Saved!",
          description: "Item saved to your collection"
        });
      }
      return newSet;
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "adminSettings", "adBanner"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAdBanner({ 
          isActive: data.isActive || false, 
          content: data.content || "",
          clicks: data.clicks || 0,
          uniqueClicks: data.uniqueClicks || {}
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdClick = async () => {
    if (!currentUser) return;
    
    try {
      const adRef = doc(db, "adminSettings", "adBanner");
      await updateDoc(adRef, {
        clicks: increment(1),
        [`uniqueClicks.${currentUser.uid}`]: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Open ad link - replace with actual ad destination
      window.open("https://example.com/promote-listing", "_blank");
    } catch (error) {
      console.error("Error tracking ad click:", error);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleShareProduct = (product: Product) => {
    toast({
      title: "Link copied!",
      description: `Product link for "${product.title}" copied to clipboard`
    });
  };

  return (
    <>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={toggleSave}
        isSaved={selectedProduct ? savedProducts.has(selectedProduct.id) : false}
      />
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            
            <main className="flex-1 pt-16 px-5 pb-5">
              <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Store className="h-8 w-8 text-primary" />
                    Marketplace
                  </h1>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Listing
                  </Button>
                </div>

                {/* Ad Banner */}
                {adBanner.isActive && adBanner.content && (
                  <div className="relative -mx-6 mb-6">
                    <div 
                      onClick={handleAdClick}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 py-8 px-6 lg:px-8"
                    >
                      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold">📢</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                              Sponsored Listing
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {adBanner.content}
                          </h3>
                          <p className="text-emerald-100 text-sm md:text-base">
                            Reach more buyers with promoted listings
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200 shadow-lg">
                            Promote Your Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filter Listings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Current Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">Current Location</SelectItem>
                            <SelectItem value="accra">Accra, Ghana</SelectItem>
                            <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                            <SelectItem value="nairobi">Nairobi, Kenya</SelectItem>
                            <SelectItem value="johannesburg">Johannesburg, SA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing & Accessories</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                            <SelectItem value="vehicles">Vehicles</SelectItem>
                            <SelectItem value="art">Art & Collectibles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Price Range</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Any Price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Price</SelectItem>
                            <SelectItem value="0-20">Under $20</SelectItem>
                            <SelectItem value="20-50">$20 - $50</SelectItem>
                            <SelectItem value="50-100">$50 - $100</SelectItem>
                            <SelectItem value="100-500">$100 - $500</SelectItem>
                            <SelectItem value="500+">Over $500</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Delivery Method</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Any Delivery" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Delivery</SelectItem>
                            <SelectItem value="pickup">Local Pickup</SelectItem>
                            <SelectItem value="shipping">Shipping Available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Banner */}
                <Card className="mb-6 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
                  <CardContent className="flex flex-col md:flex-row justify-between items-center p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-accent" />
                        Sell Commission-Free with Pro Subscription
                      </h3>
                      <p className="text-primary-foreground/90 max-w-2xl">
                        Upgrade to Pro and pay 0% commission on all your sales. Only $9.99/month for unlimited listings.
                      </p>
                    </div>
                    <Button variant="secondary" className="mt-4 md:mt-0">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product, index) => (
                    <div key={product.id}>
                      <Card 
                        className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {product.badge && (
                            <Badge 
                              className={`absolute top-2 left-2 ${
                                product.isFeatured ? 'bg-primary' : 'bg-secondary'
                              }`}
                            >
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="text-lg font-bold text-primary mb-1">
                            ${product.price}
                          </div>
                          <h3 className="font-semibold mb-2 text-foreground line-clamp-2">
                            {product.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            {product.location}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
                                  {product.seller.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {product.seller.name}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-8 h-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareProduct(product);
                                }}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-8 h-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(product.id);
                                }}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${
                                    savedProducts.has(product.id) 
                                      ? 'fill-destructive text-destructive' 
                                      : ''
                                  }`} 
                                />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Load More Listings
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Marketplace;