import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface AvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'medium',
  backgroundColor = '#3498db',
  textColor = 'white',
  style,
  textStyle,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = [
    styles.avatar,
    styles[size],
    { backgroundColor },
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${size}Text`],
    { color: textColor },
    textStyle,
  ];

  return (
    <View style={avatarStyle}>
      <Text style={textStyleCombined}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sizes
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 50,
    height: 50,
  },
  large: {
    width: 70,
    height: 70,
  },
  xlarge: {
    width: 100,
    height: 100,
  },
  // Text styles
  text: {
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 24,
  },
  xlargeText: {
    fontSize: 32,
  },
});
