import { useState } from "react";
import TribeCreator from "@/components/tribes/TribeCreator";
import TribeFilter from "@/components/tribes/TribeFilter";
import TribeList from "@/components/tribes/TribeList";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * MyTribe Page
 * Combines the creation, filtering, and listing UI
 * into one clean page that works for both web and mobile.
 */
export default function MyTribePage() {
  const [tribes, setTribes] = useState([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Tribe Pulse Communities
          </Text>
          <Text style={{ fontSize: 14, color: "#4b5563" }}>
            Create or explore tribes that match your interests.
          </Text>
        </View>

        {/* Create Tribe Section */}
        <View style={{ marginBottom: 32 }}>
          <TribeCreator />
        </View>

        {/* Filter + Search */}
        <View style={{ marginBottom: 16 }}>
          <TribeFilter onResults={setTribes} />
        </View>

        {/* Tribe List */}
        <View style={{ marginBottom: 48 }}>
          <TribeList tribes={tribes} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
