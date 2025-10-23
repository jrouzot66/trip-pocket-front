import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  margin = 0,
  shadow = true,
}) => {
  const cardStyle = [
    styles.card,
    shadow && styles.shadow,
    { padding, margin },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  shadow: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 5,
  },
});
