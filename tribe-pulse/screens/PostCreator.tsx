import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function PostCreator({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing Info", "Please enter a title and content.");
      return;
    }
    console.log("Post created:", { title, content });
    Alert.alert("Success", "Your post has been created!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a Post</Text>

      <TextInput
        placeholder="Post title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Write your post..."
        value={content}
        onChangeText={setContent}
        multiline
        style={[styles.input, { height: 100 }]}
      />

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "red",
  },
});
