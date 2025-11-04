import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="add-contact" options={{ title: "Add Contact" }} />
      <Stack.Screen name="edit-contact" options={{ title: "Edit Contact" }} />
    </Stack>
  );
}
