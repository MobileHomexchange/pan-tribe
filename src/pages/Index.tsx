import { Layout } from "@/components/layout/Layout";
import AppMobileSkeleton from "@/components/AppMobileSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  // On mobile, show the mobile skeleton instead of the desktop layout
  if (isMobile) {
    return <AppMobileSkeleton />;
  }

  return <Layout />;
};

export default Index;
