// Regex pour valider le mot de passe
// Doit contenir : au moins 1 majuscule, 1 chiffre, 1 caractère spécial, minimum 8 caractères
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordRequirements = (): string[] => {
  return [
    'Au moins 8 caractères',
    'Au moins une majuscule (A-Z)',
    'Au moins un chiffre (0-9)',
    'Au moins un caractère spécial (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?'
  ];
};
