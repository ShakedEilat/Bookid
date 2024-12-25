import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import { observer } from "mobx-react";
import { authStore } from "../stores/authStore";
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, Button, StyleSheet } from "react-native";
const AppLayout = observer(() => {
  const router = useRouter();

  useEffect(() => {
    // Load token from AsyncStorage when app starts
    authStore.loadToken();
  }, []);

  useEffect(() => {
    // Redirect to login screen if not authenticated
    if (!authStore.isAuthenticated) {
      console.log("Not authenticatedsdas");
      router.replace("/Login");
    }
  }, [authStore.isAuthenticated]);

  // Drawer for authenticated users
  if (authStore.isAuthenticated) {
    return (
      <Drawer
      screenOptions={({ route }) => ({
        headerShown: true,
        // drawerItemStyle: route.name.includes("book") || route.name === "EditChildProfile"|| route.name === "Login" || route.name === "Register"? { display: "none" } : {}, // Hide BookReader
      })}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="Library" options={{ title: "Library" }} />
        <Drawer.Screen name="ChildProfiles" options={{ title: "Profiles" }} />
        <Drawer.Screen name="Settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="book/[id]" options={{
                  drawerItemStyle: { display: 'none' },
                  title: "My Book"
        }} />
        <Drawer.Screen name="book/create" options={{
                  drawerItemStyle: { display: 'none' },
                  title: "Create A Book"
        }} />
        <Drawer.Screen name="CreateChildProfile" options={{
                  drawerItemStyle: { display: 'none' },
                  title: "Child Profile"
        }} />
        <Drawer.Screen name="editChildProfile/[id]" options={{
                  drawerItemStyle: { display: 'none' },
                  title: "Child Profile"
        }} />
        <Drawer.Screen name="Login" options={{
                  drawerItemStyle: { display: 'none' },
        }} />
        <Drawer.Screen name="Register" options={{
                  drawerItemStyle: { display: 'none' }
        }} />
      </Drawer>

// {/* <Tabs>
// <TabSlot />
// <TabList>
//   <TabTrigger name="index" href="/">
//     <Text>Home</Text>
//   </TabTrigger>
//   <TabTrigger name="Library" href="/Library">
//     <Text>Library</Text>
//   </TabTrigger>
// </TabList>
// </Tabs> */}
    );
  }

  // Stack for unauthenticated users
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" options={{ title: "Login" }} />
      <Stack.Screen name="Register" options={{ title: "Register" }} />
    </Stack>
  );
});

export default AppLayout;
