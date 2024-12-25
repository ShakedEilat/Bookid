import React from 'react';
import { View, Text } from 'react-native';
import EditChildProfile from '../components/EditChildProfile';
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CreateChildProfileScreen({ route }) {
  return <EditChildProfile/>;
}
