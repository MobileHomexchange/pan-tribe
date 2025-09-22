import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  MessageCircle, 
  Shield, 
  Truck, 
  RefreshCcw,
  CheckCircle,
  Clock,
  User
} from "lucide-react";

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

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string) => void;
  isSaved: boolean;
}

export function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onSave, 
  isSaved 
}: ProductDetailModalProps) {
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  // Mock additional product details
  const productDetails = {
    description: `High-quality ${product.title.toLowerCase()} in excellent condition. Perfect for everyday use or special occasions. This item has been well-maintained and comes from a smoke-free home.`,
    condition: "Like New",
    category: "Electronics",
    postedDate: "2 days ago",
    views: 127,
    images: [
      product.image,
      "https://images.unsplash.com/photo-1560472355-109703aa3edc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ],
    sellerRating: 4.8,
    sellerReviews: 23,
    sellerJoined: "June 2023",
    deliveryOptions: ["Local Pickup", "Delivery Available"],
    paymentMethods: ["Cash", "Mobile Money", "Bank Transfer"]
  };

  const handleShare = () => {
    toast({
      title: "Link copied!",
      description: `Product link for "${product.title}" copied to clipboard`
    });
  };

  const handleContact = () => {
    toast({
      title: "Opening chat",
      description: `Starting conversation with ${product.seller.name}`
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Purchase initiated",
      description: `Starting purchase process for "${product.title}"`
    });
  };

  const handleMakeOffer = () => {
    toast({
      title: "Make an offer",
      description: "Opening offer dialog..."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={productDetails.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.badge && (
                <Badge 
                  className={`absolute top-3 left-3 ${
                    product.isFeatured ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  {product.badge}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(product.id);
                }}
              >
                <Heart 
                  className={`w-4 h-4 ${
                    isSaved ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
              </Button>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {productDetails.images.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Price and Title */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                ${product.price}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {product.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {productDetails.postedDate}
                </div>
                <div>{productDetails.views} views</div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleBuyNow} className="w-full">
                  Buy Now
                </Button>
                <Button variant="outline" onClick={handleMakeOffer} className="w-full">
                  Make Offer
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleContact} className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
                <Button variant="outline" onClick={handleShare} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Separator />

            {/* Seller Information */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {product.seller.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{product.seller.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {productDetails.sellerRating}
                      </div>
                      <span>({productDetails.sellerReviews} reviews)</span>
                      <span>•</span>
                      <span>Joined {productDetails.sellerJoined}</span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <div className="font-medium">{productDetails.condition}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">{productDetails.category}</div>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground text-sm">Description:</span>
                  <p className="text-sm mt-1">{productDetails.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Payment */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">Delivery & Payment</h3>
                
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium">Delivery Options</span>
                  </div>
                  <div className="space-y-1">
                    {productDetails.deliveryOptions.map((option, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Payment Methods</span>
                  </div>
                  <div className="space-y-1">
                    {productDetails.paymentMethods.map((method, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {method}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCcw className="w-4 h-4" />
                  <span>30-day return policy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}