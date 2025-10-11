// navigation-menu.tsx
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ✅ If you have a Tabs component, keep this import.
//    If your Tabs file is elsewhere, adjust the path.
import Tabs from "./Tabs";

// ✅ Import PostCreator. Adjust the path if your file lives elsewhere.
// For example, if PostCreator lives at src/screens/PostCreator.tsx:
import PostCreator from "../screens/PostCreator";

export type RootStackParamList = {
  Tabs: undefined;
  PostCreator: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function NavigationMenu() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <RootStack.Screen
          name="PostCreator"
          component={PostCreator}
          options={{
            title: "Create Post",
            // You can remove 'presentation' if you prefer a standard push screen.
            presentation: "modal",
            headerBackTitle: "Back",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
