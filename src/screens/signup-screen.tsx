import React, { useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { globalStyles } from '../styles/global-styles';
import InputField from '../components/input-field';
import PrimaryButton from '../components/primary-button';
import { useAuth } from '../context/auth-context';
import { validateSignupForm, SignupFormErrors } from '../utils/validation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup() {
    const validationErrors = validateSignupForm(name, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await signup(name, email, password);
      // AuthContext sets `user`, navigator switches to Home automatically.
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Signup failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>Create account</Text>
        <Text style={globalStyles.subtitle}>Sign up to get started</Text>

        <InputField
          icon="person-outline"
          placeholder="Name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
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
          title={submitting ? 'Creating account...' : 'Signup'}
          onPress={handleSignup}
          disabled={submitting}
        />

        <PrimaryButton
          title="Go to Login"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}
