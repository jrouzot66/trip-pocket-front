import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useRegister } from '../src/lib/useRegister';
import { useAuthStore } from '../src/store/authStore';
import alert from '../src/utils/alert';
import { getPasswordRequirements, validatePassword } from '../src/utils/passwordValidation';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    firstname: '',
    lastname: '',
    birthday: '',
    countryCode: 'FR',
    language: 'fr',
    genderCode: 'MAN',
    city: '',
    thumbnail: '',
    rgpd: false,
    visibility: 'PUBLIC'
  });

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

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      firstname: '',
      lastname: '',
      birthday: '',
      countryCode: 'FR',
      language: 'fr',
      genderCode: 'MAN',
      city: '',
      thumbnail: '',
      rgpd: false,
      visibility: 'PUBLIC'
    });
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
          </View>

          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Prénom *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Votre prénom"
                    value={formData.firstname}
                    onChangeText={(value) => updateFormData('firstname', value)}
                    editable={!isLoading}
                    placeholderTextColor="#999"
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Nom *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Votre nom"
                    value={formData.lastname}
                    onChangeText={(value) => updateFormData('lastname', value)}
                    editable={!isLoading}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nom d'utilisateur *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Choisissez un nom d'utilisateur"
                  value={formData.username}
                  onChangeText={(value) => updateFormData('username', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Téléphone *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0601010101 ou +33601010101"
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mot de passe *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe sécurisé"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
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
            </View>

            {/* Informations supplémentaires */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations supplémentaires</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date de naissance *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={formData.birthday}
                  onChangeText={(value) => updateFormData('birthday', value)}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ville *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre ville"
                  value={formData.city}
                  onChangeText={(value) => updateFormData('city', value)}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Pays</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="FR"
                    value={formData.countryCode}
                    onChangeText={(value) => updateFormData('countryCode', value)}
                    editable={!isLoading}
                    placeholderTextColor="#999"
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Langue</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="fr"
                    value={formData.language}
                    onChangeText={(value) => updateFormData('language', value)}
                    editable={!isLoading}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Genre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MAN"
                  value={formData.genderCode}
                  onChangeText={(value) => updateFormData('genderCode', value)}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
              </View>
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
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Créer mon compte</Text>
              )}
            </TouchableOpacity>

            {/* Lien vers connexion */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/')}
              disabled={isLoading}
            >
              <Text style={styles.loginLinkText}>
                Déjà un compte ? Se connecter
              </Text>
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
});
