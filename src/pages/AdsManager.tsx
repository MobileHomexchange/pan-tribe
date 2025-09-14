import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  TrendingUp, 
  Crown,
  CheckCircle2
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  badge?: string;
  icon: any;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Boost",
    price: 15,
    badge: "Most Popular",
    icon: Rocket,
    description: "Perfect for testing the waters with a single high-priority item.",
    features: [
      "20,000+ guaranteed impressions",
      "Prime placement in category feeds",
      "Featured Listings carousel",
      "1 listing promoted"
    ]
  },
  {
    id: "steady",
    name: "Steady Seller",
    price: 35,
    badge: "Best Value",
    icon: TrendingUp,
    description: "Ideal for sellers with small inventory who want consistent results.",
    features: [
      "50,000+ guaranteed impressions",
      "Top of search results placement",
      "Priority in location feeds",
      "Up to 3 listings promoted"
    ],
    isPopular: true
  },
  {
    id: "power",
    name: "Power Seller",
    price: 75,
    icon: Crown,
    description: "For serious sellers who rely on our platform for significant sales.",
    features: [
      "Unlimited impressions",
      "Premium homepage placement",
      "Enhanced analytics dashboard",
      "All active listings promoted"
    ]
  }
];

const faqs = [
  {
    question: "How do I choose the right plan for my business?",
    answer: "If you're new to advertising or have just a few items, start with the Starter Boost. For consistent sellers with multiple items, the Steady Seller offers great value. Power sellers with large inventories will benefit most from the Power Seller plan."
  },
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle."
  },
  {
    question: "How are impressions counted?",
    answer: "An impression is counted each time your ad is shown to a potential buyer. We guarantee a minimum number of impressions based on your selected plan."
  },
  {
    question: "Is there a long-term contract?",
    answer: "No, all plans are month-to-month with no long-term commitment. You can cancel at any time."
  }
];

const AdsManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleSelectPlan = (tierName: string) => {
    alert(`You've selected the ${tierName} plan! This would proceed to checkout in a real application.`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Boost Your Listings with Ads
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Simple, predictable pricing to increase your visibility and sales. 
                  Choose the plan that works best for your business.
                </p>
              </div>

              {/* Pricing Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tier.id}
                  className={`relative p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${
                    tier.isPopular ? 'border-2 border-primary scale-105' : ''
                  }`}
                >
                  {tier.badge && (
                    <Badge 
                      className="absolute -top-3 right-4 bg-primary text-primary-foreground"
                    >
                      {tier.badge}
                    </Badge>
                  )}
                  
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                  
                  <div className="text-4xl font-bold text-primary mb-6">
                    ${tier.price}
                    <span className="text-lg font-medium text-muted-foreground">/month</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-8">{tier.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-left">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full"
                    variant={tier.isPopular ? "default" : "outline"}
                    onClick={() => handleSelectPlan(tier.name)}
                  >
                    Get Started
                  </Button>
                </Card>
              );
            })}
          </div>

              {/* FAQ Section */}
              <Card className="p-10">
                <h2 className="text-3xl font-bold text-center mb-10">
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-8">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border pb-6 last:border-b-0">
                      <h3 className="text-xl font-semibold mb-3 text-foreground">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdsManager;