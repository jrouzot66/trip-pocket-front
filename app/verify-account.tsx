import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import alert from '../src/utils/alert';
import apiClient from './config/apiClient';

interface VerifyResponse {
  statusCode: number;
  message: string;
  datas: {
    accessToken: string;
    verifyAccount: boolean;
  };
}

export default function VerifyAccountScreen() {
  const { identifier, password } = useLocalSearchParams<{ identifier: string; password: string }>();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      alert('Erreur', 'Veuillez entrer le code de vérification');
      return;
    }

    if (!identifier) {
      alert('Erreur', 'Identifiant manquant');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.post<VerifyResponse>('/auth/verify', {
        identifier,
        code: verificationCode.trim()
      });
      
      const { statusCode, message, datas } = response.data;
      
      if (__DEV__) {
        console.log('🔧 Verify response:', { statusCode, message, datas });
      }
      
      if (statusCode === 200 && datas?.accessToken && datas?.verifyAccount && typeof datas.accessToken === 'string') {
        await setToken(datas.accessToken);
        alert('Succès', 'Votre compte a été vérifié avec succès !');
        router.replace('/profile');
      } else {
        alert('Erreur', message || 'Code de vérification invalide');
      }
    } catch (error: any) {
      console.error('Erreur de vérification:', error);
      alert('Erreur', 'Code de vérification invalide ou expiré');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!identifier || !password) {
      alert('Erreur', 'Identifiants manquants pour renvoyer le code');
      return;
    }

    setIsLoading(true);
    
    try {
      // Refaire la connexion pour déclencher l'envoi d'un nouveau code
      // Le serveur renverra le même message "Compte non vérifié" avec un nouveau code
      const response = await apiClient.post('/auth/login', {
        identifier,
        password
      });
      
      const { statusCode, message } = response.data;
      
      if (statusCode === 200) {
        alert('Succès', 'Un nouveau code de vérification a été envoyé à votre adresse email');
      } else {
        alert('Erreur', message || 'Impossible d\'envoyer un nouveau code');
      }
    } catch (error: any) {
      console.error('Erreur de renvoi:', error);
      alert('Erreur', 'Impossible d\'envoyer un nouveau code. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.title}>Vérification du compte</Text>
            <Text style={styles.subtitle}>
              Un code de vérification a été envoyé à votre adresse email. 
              Entrez le code ci-dessous pour activer votre compte.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Code de vérification</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez le code à 8 caractères"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="default"
                maxLength={8}
                editable={!isLoading}
                placeholderTextColor="#999"
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Vérifier le compte</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resendButton, isLoading && styles.resendButtonDisabled]}
              onPress={handleResendCode}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.resendButtonText}>Renvoyer le code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Le code à 8 caractères est valable 10 minutes.{'\n'}
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Retour à la connexion</Text>
              </TouchableOpacity>
            </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
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
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
    letterSpacing: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 5,
  },
  verifyButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0 4px 8px rgba(39,174,96,0.3)',
    elevation: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: '#bdc3c7',
    elevation: 0,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  resendButtonDisabled: {
    borderColor: '#bdc3c7',
  },
  resendButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#3498db',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
