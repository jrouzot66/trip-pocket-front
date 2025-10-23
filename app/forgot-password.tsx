import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { usePasswordReset } from './lib/hooks/usePasswordReset';
import alert from './utils/alert';
import { getPasswordRequirements, validatePassword } from './utils/passwordValidation';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { requestReset, updatePassword, isLoading, error, isSuccess, reset } = usePasswordReset();

  const handleRequestReset = async () => {
    if (!email.trim()) {
      alert('Erreur', 'Veuillez entrer votre adresse email');
      return;
    }

    await requestReset({ email: email.trim() });
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      alert('Erreur', 'Veuillez entrer le code de réinitialisation');
      return;
    }

    // Simuler la vérification du code - passer à l'étape suivante
    setStep('password');
  };

  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      alert('Erreur', 'Veuillez entrer un nouveau mot de passe');
      return;
    }

    if (password !== confirmPassword) {
      alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      alert('Erreur', passwordValidation.errors.join('\n'));
      return;
    }

    await updatePassword({
      email: email.trim(),
      code: code.trim(),
      password: password.trim()
    });
  };

  const handleSuccess = () => {
    if (step === 'email' && isSuccess) {
      setStep('code');
      reset();
    } else if (step === 'password' && isSuccess) {
      alert('Succès', 'Votre mot de passe a été mis à jour avec succès !');
      router.replace('/');
    }
  };

  React.useEffect(() => {
    handleSuccess();
  }, [isSuccess]);

  const renderEmailStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Mot de passe oublié</Text>
        <Text style={styles.subtitle}>
          Entrez votre adresse email pour recevoir un code de réinitialisation
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            placeholderTextColor="#999"
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRequestReset}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Envoyer le code</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCodeStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Code de réinitialisation</Text>
        <Text style={styles.subtitle}>
          Entrez le code reçu par email à l'adresse {email}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Code de réinitialisation</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le code à 8 caractères"
            value={code}
            onChangeText={setCode}
            keyboardType="default"
            maxLength={8}
            editable={!isLoading}
            placeholderTextColor="#999"
            autoFocus
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyCode}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Vérifier le code</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Nouveau mot de passe</Text>
        <Text style={styles.subtitle}>
          Choisissez un nouveau mot de passe sécurisé
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            placeholderTextColor="#999"
          />
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Le mot de passe doit contenir :</Text>
            {getPasswordRequirements().map((requirement, index) => (
              <Text key={index} style={styles.requirementText}>
                • {requirement}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
            placeholderTextColor="#999"
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleUpdatePassword}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Mettre à jour le mot de passe</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

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
          {step === 'email' && renderEmailStep()}
          {step === 'code' && renderCodeStep()}
          {step === 'password' && renderPasswordStep()}

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.linkText}>Retour à la connexion</Text>
            </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#3498db',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  passwordRequirements: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 11,
    color: '#7f8c8d',
    lineHeight: 16,
  },
});
