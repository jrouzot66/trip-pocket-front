import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthInit } from "./hooks/useAuthInit";

export default function RootLayout() {
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
