import EditChildProfile from '../../components/EditChildProfile';
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditChildProfileScreen({ route }) {
  const { id } = useLocalSearchParams(); // This gets the query params, such as profile ID
  return <EditChildProfile profileId={id} />;
}
