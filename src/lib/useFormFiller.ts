import { useState } from 'react';

interface FormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  firstname: string;
  lastname: string;
  birthday: string;
  countryCode: string;
  language: string;
  genderCode: string;
  city: string;
  thumbnail: string;
  rgpd: boolean;
  visibility: string;
}

const defaultFormData: FormData = {
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
};

export const useFormFiller = (initialData: FormData = defaultFormData) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const fillWithRandomData = () => {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Antoine', 'Camille', 'Lucas', 'Emma', 'Thomas', 'Léa'];
    const lastNames = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent'];
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
    const genders = ['MAN', 'WOMAN', 'OTHER'];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    
    // Générer une date de naissance aléatoire (entre 18 et 65 ans)
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - 18 - Math.floor(Math.random() * 47);
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    // Générer un numéro de téléphone aléatoire
    const phoneNumber = '0' + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + 
                       Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + 
                       Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + 
                       Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + '0';
    
    // Générer un mot de passe sécurisé
    const securePassword = 'Test123!@#';
    
    setFormData({
      username: `${randomFirstName.toLowerCase()}${randomLastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
      email: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@example.com`,
      password: securePassword,
      phone: phoneNumber,
      firstname: randomFirstName,
      lastname: randomLastName,
      birthday: `${birthYear}-${birthMonth}-${birthDay}`,
      countryCode: 'FR',
      language: 'fr',
      genderCode: randomGender,
      city: randomCity,
      thumbnail: '',
      rgpd: true,
      visibility: 'PUBLIC'
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    fillWithRandomData,
    resetForm,
    updateFormData
  };
};
