import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button, Input } from '../src/components';
import { useLogin } from '../src/lib/useLogin';
import { useAuthStore } from '../src/store/authStore';
import alert from '../src/utils/alert';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading, error, reset, needsVerification } = useLogin();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeIsLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (isAuthenticated && !storeIsLoading) {
      const timer = setTimeout(() => {
        router.replace('/profile');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, storeIsLoading]);

  useEffect(() => {
    if (needsVerification) {
      const timer = setTimeout(() => {
        router.push({
          pathname: '/verify-account',
          params: { identifier, password }
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [needsVerification, identifier, password]);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    await login({ identifier: identifier.trim(), password });
  };

  const handleReset = () => {
    reset();
    setIdentifier('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Trip Pocket</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Entrez votre email"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              editable={!isLoading}
              error={error || undefined}
            />

            <Input
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            {process.env.NODE_ENV === 'development' && (
              <Button
                title="Préremplir mot de passe"
                onPress={() => setPassword('Test123!@#')}
                variant="secondary"
                size="small"
                style={{ marginBottom: 12 }}
              />
            )}

            <Button
              title={isLoading ? "Connexion..." : "Se connecter"}
              onPress={handleLogin}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Mot de passe oublié ?"
              onPress={() => router.push('/forgot-password' as any)}
              disabled={isLoading}
              variant="secondary"
              size="small"
              style={styles.forgotPasswordButton}
            />
            
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>
                Pas encore de compte ?
              </Text>
              <Button
                title="Créer un compte"
                onPress={() => router.push('/register' as any)}
                variant="secondary"
                size="small"
                style={styles.linkButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    fontSize: 16,
    color: '#2c3e50',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerTextContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  forgotPasswordButton: {
    marginBottom: 10,
  },
  linkButton: {
    marginTop: 8,
  },
});
