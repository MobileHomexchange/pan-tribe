import React from "react";
import { Layout } from "@/components/layout/Layout";
import TribeLayout from "@/components/layout/TribeLayout";
import MainFeed from "@/components/feed/MainFeed";

export default function Feed() {
  return (
    <Layout>
      <TribeLayout>
        <MainFeed />
      </TribeLayout>
    </Layout>
  );
}
