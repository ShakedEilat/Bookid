import { useEffect, useState, useCallback } from "react";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { observer } from "mobx-react";
import { profileStore } from '../stores/profileStore';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const ProfileListScreen = observer(() => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await profileStore.fetchProfiles();
        setLoading(false);
      };
      fetchData();
      return () => {
      };
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await profileStore.fetchProfiles();
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderProfile = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/editChildProfile/${item._id}`)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.age}>Age: {item.age}</Text>
      <View style={styles.actions}>
        <Button title="Edit" onPress={() => router.push(`/editChildProfile/${item._id}`)} />
        <Button
          title="Create a new book"
          color="orange"
          onPress={() => router.push(`/book/create`)}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading profiles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Child Profiles</Text>
      <Text style={styles.subHeader}>Total Profiles: {profileStore.profiles?.length}</Text>
      {profileStore.profiles?.length === 0 ? (
        <Text style={styles.emptyState}>No profiles found. Add a new profile to get started!</Text>
      ) : (
        <FlatList
          data={profileStore.profiles}
          renderItem={renderProfile}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
      <Button title="Add New Profile" onPress={() => router.push('/CreateChildProfile')} />
    </View>
  );
});

export default ProfileListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  age: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
});
