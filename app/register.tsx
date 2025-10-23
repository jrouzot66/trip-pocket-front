import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Input } from '../src/components';
import { useFormFiller } from '../src/lib/useFormFiller';
import { useRegister } from '../src/lib/useRegister';
import { useAuthStore } from '../src/store/authStore';
import alert from '../src/utils/alert';
import { getPasswordRequirements, validatePassword } from '../src/utils/passwordValidation';

export default function RegisterScreen() {
  const { formData, setFormData, fillWithRandomData, resetForm, updateFormData } = useFormFiller();

  const { register, isLoading, error, reset } = useRegister();
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


  const validateForm = (): boolean => {
    const requiredFields = ['username', 'email', 'password', 'phone', 'firstname', 'lastname', 'birthday', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (!formData.rgpd) {
      alert('Erreur', 'Vous devez accepter les conditions RGPD');
      return false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      alert('Erreur', passwordValidation.errors.join('\n'));
      return false;
    }

    // Validation du numéro de téléphone
    if (formData.phone.length < 10) {
      alert('Erreur', 'Le numéro de téléphone doit contenir au moins 10 caractères');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    await register(formData);
  };

  const handleReset = () => {
    reset();
    resetForm();
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Trip Pocket</Text>
            
            {/* Bouton de développement - visible uniquement en mode dev */}
            {process.env.NODE_ENV === 'development' && (
              <TouchableOpacity
                style={styles.devButton}
                onPress={fillWithRandomData}
                activeOpacity={0.8}
              >
                <Text style={styles.devButtonText}>🔧 Remplir avec des données aléatoires</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Input
                    label="Prénom *"
                    placeholder="Votre prénom"
                    value={formData.firstname}
                    onChangeText={(value: string) => updateFormData('firstname', value)}
                    editable={!isLoading}
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Input
                    label="Nom *"
                    placeholder="Votre nom"
                    value={formData.lastname}
                    onChangeText={(value: string) => updateFormData('lastname', value)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <Input
                label="Nom d'utilisateur *"
                placeholder="Choisissez un nom d'utilisateur"
                value={formData.username}
                onChangeText={(value: string) => updateFormData('username', value)}
                editable={!isLoading}
              />

              <Input
                label="Email *"
                placeholder="votre@email.com"
                value={formData.email}
                onChangeText={(value: string) => updateFormData('email', value)}
                keyboardType="email-address"
                editable={!isLoading}
              />

              <Input
                label="Téléphone *"
                placeholder="0601010101 ou +33601010101"
                value={formData.phone}
                onChangeText={(value: string) => updateFormData('phone', value)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />

              <Input
                label="Mot de passe *"
                placeholder="Mot de passe sécurisé"
                value={formData.password}
                onChangeText={(value: string) => updateFormData('password', value)}
                secureTextEntry
                editable={!isLoading}
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

            {/* Informations supplémentaires */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations supplémentaires</Text>
              
              <Input
                label="Date de naissance *"
                placeholder="YYYY-MM-DD"
                value={formData.birthday}
                onChangeText={(value: string) => updateFormData('birthday', value)}
                editable={!isLoading}
              />

              <Input
                label="Ville *"
                placeholder="Votre ville"
                value={formData.city}
                onChangeText={(value: string) => updateFormData('city', value)}
                editable={!isLoading}
              />

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Input
                    label="Pays"
                    placeholder="FR"
                    value={formData.countryCode}
                    onChangeText={(value: string) => updateFormData('countryCode', value)}
                    editable={!isLoading}
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Input
                    label="Langue"
                    placeholder="fr"
                    value={formData.language}
                    onChangeText={(value: string) => updateFormData('language', value)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <Input
                label="Genre"
                placeholder="MAN"
                value={formData.genderCode}
                onChangeText={(value: string) => updateFormData('genderCode', value)}
                editable={!isLoading}
              />
            </View>

            {/* Conditions */}
            <View style={styles.section}>
              <View style={styles.rgpdContainer}>
                <Switch
                  value={formData.rgpd}
                  onValueChange={(value) => updateFormData('rgpd', value)}
                  disabled={isLoading}
                  trackColor={{ false: '#e1e8ed', true: '#3498db' }}
                  thumbColor={formData.rgpd ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.rgpdText}>
                  J'accepte les conditions d'utilisation et la politique de confidentialité *
                </Text>
              </View>
            </View>

            {/* Message d'erreur */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Boutons */}
            <Button
              title={isLoading ? "Création du compte..." : "Créer mon compte"}
              onPress={handleRegister}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={styles.registerButton}
            />

            {/* Lien vers connexion */}
            <Button
              title="Déjà un compte ? Se connecter"
              onPress={() => router.push('/')}
              disabled={isLoading}
              variant="secondary"
              size="small"
              style={styles.loginLink}
            />
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
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    fontSize: 16,
    color: '#2c3e50',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  rgpdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  rgpdText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
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
  registerButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    boxShadow: '0 4px 8px rgba(52,152,219,0.3)',
    elevation: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#bdc3c7',
    elevation: 0,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    boxShadow: '0 4px 8px rgba(39,174,96,0.3)',
    elevation: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
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
  devButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#e67e22',
  },
  devButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
