import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FeedScreen from "../screens/FeedScreen";
import PostCreator from "../screens/PostCreator";
import Comments from "../screens/Comments";

export type RootStackParamList = {
  Feed: undefined;
  PostCreator: undefined;
  Comments: { postId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function NavigationMenu() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: "Tribe Pulse" }} />
        <Stack.Screen name="PostCreator" component={PostCreator} options={{ title: "Create Post" }} />
        <Stack.Screen name="Comments" component={Comments} options={{ title: "Comments" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
