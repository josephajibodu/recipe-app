import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";

Sentry.init({
  dsn: "https://64aa9982f6e38b9fb2d4e8ad217009e6@o4504776356003840.ingest.us.sentry.io/4509312162267136",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerTintColor: Colors[colorScheme ?? "light"].text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="recipe/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="recipe/new"
          options={{
            title: "New Recipe",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="recipe/edit/[id]"
          options={{
            title: "Edit Recipe",
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
});
