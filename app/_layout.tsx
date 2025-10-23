import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthInit } from "./lib/hooks/useAuthInit";

// Import Storybook conditionally
let StorybookUIRoot;
try {
  StorybookUIRoot = require("../.storybook/Storybook").default;
} catch (e) {
  // Storybook not available
}

export default function RootLayout() {
  // Check if we want to run Storybook
  const isStorybookMode = process.env.EXPO_PUBLIC_STORYBOOK === 'true';
  
  if (isStorybookMode && StorybookUIRoot) {
    return <StorybookUIRoot />;
  }

  const { isLoading } = useAuthInit();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack />;
}