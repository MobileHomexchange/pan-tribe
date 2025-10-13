import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function FeedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tribe Pulse Feed</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PostCreator")}
      >
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#34C759", marginTop: 15 }]}
        onPress={() => navigation.navigate("Comments", { postId: "test" })}
      >
        <Text style={styles.buttonText}>View Comments</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
