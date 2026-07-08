import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/global-styles';
import PrimaryButton from '../components/primary-button';
import { useAuth } from '../context/auth-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>Welcome, {user?.name}</Text>
        <Text style={globalStyles.subtitle}>{user?.email}</Text>

        <PrimaryButton title="Logout" variant="outline" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}
