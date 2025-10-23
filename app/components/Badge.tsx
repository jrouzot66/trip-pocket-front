import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface BadgeProps {
  text: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const badgeStyle = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyleCombined}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  // Variants
  primary: {
    backgroundColor: '#3498db',
  },
  secondary: {
    backgroundColor: '#95a5a6',
  },
  success: {
    backgroundColor: '#27ae60',
  },
  warning: {
    backgroundColor: '#f39c12',
  },
  danger: {
    backgroundColor: '#e74c3c',
  },
  // Sizes
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 16,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 20,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 24,
  },
  // Text styles
  text: {
    fontWeight: '600',
    color: 'white',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
