// FeedScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Share } from "react-native";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  // 🔥 Fetch posts live from Firestore
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // ❤️ Like a post
  const handleLike = async (postId) => {
    try {
      await updateDoc(doc(db, "posts", postId), { likes: increment(1) });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // 🔗 Share a post
  const handleShare = async (post) => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.content}`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // 🧩 Render each post
  const renderPost = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
      <Text style={{ marginVertical: 10 }}>{item.content}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          borderTopWidth: 1,
          borderColor: "#eee",
          paddingTop: 10,
        }}
      >
        {/* ❤️ Like Button */}
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text>👍 {item.likes ?? 0}</Text>
        </TouchableOpacity>

        {/* 💬 Comment Button */}
        <TouchableOpacity onPress={() => navigation.navigate("Comments", { postId: item.id })}>
          <Text>💬 {item.commentsCount ?? 0}</Text>
        </TouchableOpacity>

        {/* 🔗 Share Button */}
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Text>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
}
