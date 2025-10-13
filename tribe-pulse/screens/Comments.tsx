import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Comments({ navigation, route }) {
  const { postId } = route.params || {}; // just in case no postId is passed

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments Screen</Text>
      {postId ? (
        <Text style={styles.subtitle}>Post ID: {postId}</Text>
      ) : (
        <Text style={styles.subtitle}>No post selected</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
