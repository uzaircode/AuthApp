import React, { useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { globalStyles } from '../styles/global-styles';
import InputField from '../components/input-field';
import PrimaryButton from '../components/primary-button';
import { useAuth } from '../context/auth-context';
import { validateLoginForm, LoginFormErrors } from '../utils/validation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await login(email, password);
      // No manual navigation needed — the navigator switches to Home
      // automatically once `user` is set in AuthContext.
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>Welcome back</Text>
        <Text style={globalStyles.subtitle}>Log in to your account</Text>

        <InputField
          icon="mail-outline"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <InputField
          icon="lock-closed-outline"
          placeholder="Password"
          isPassword
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        {errors.form ? (
          <Text style={globalStyles.errorText}>{errors.form}</Text>
        ) : null}

        <PrimaryButton
          title={submitting ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={submitting}
        />

        <PrimaryButton
          title="Go to Signup"
          variant="outline"
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </SafeAreaView>
  );
}
