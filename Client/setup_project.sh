# Step 1: Create the directories for components and screens
mkdir -p app components

# Step 2: Create the Settings Screen File

# app/settings.jsx
echo 'import { View, Text, Button, StyleSheet } from "react-native";
import { observer } from "mobx-react";
import { authStore } from "../stores";

const SettingsScreen = observer(() => {
  const handleLogout = async () => {
    await authStore.logout();
  };

  return (
    <View style={styles.container}>
      <Text>Email: {authStore.user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
});

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
' > app/settings.jsx

# Step 3: Create the Reusable Components

# components/Loader.jsx
echo 'import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
' > components/Loader.jsx

# components/ChildProfileForm.jsx
echo 'import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function ChildProfileForm({ initialValues = {}, onSubmit }) {
  const [name, setName] = useState(initialValues.name || "");
  const [age, setAge] = useState(initialValues.age || "");

  const handleSubmit = () => {
    onSubmit({ name, age });
  };

  return (
    <View style={styles.container}>
      <Text>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Age</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
' > components/ChildProfileForm.jsx
