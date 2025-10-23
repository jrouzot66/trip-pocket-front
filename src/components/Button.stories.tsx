import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'success'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Primary = {
  args: {
    title: 'Primary Button',
    onPress: () => console.log('Button pressed'),
    variant: 'primary',
    size: 'medium',
  },
};

export const Secondary = {
  args: {
    title: 'Secondary Button',
    onPress: () => console.log('Button pressed'),
    variant: 'secondary',
    size: 'medium',
  },
};

export const Danger = {
  args: {
    title: 'Danger Button',
    onPress: () => console.log('Button pressed'),
    variant: 'danger',
    size: 'medium',
  },
};

export const Success = {
  args: {
    title: 'Success Button',
    onPress: () => console.log('Button pressed'),
    variant: 'success',
    size: 'medium',
  },
};

export const Disabled = {
  args: {
    title: 'Disabled Button',
    onPress: () => console.log('Button pressed'),
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
};

export const Loading = {
  args: {
    title: 'Loading Button',
    onPress: () => console.log('Button pressed'),
    variant: 'primary',
    size: 'medium',
    loading: true,
  },
};

export const AllSizes = {
  render: () => (
    <>
      <Button title="Small" onPress={() => console.log('Button pressed')} size="small" />
      <Button title="Medium" onPress={() => console.log('Button pressed')} size="medium" />
      <Button title="Large" onPress={() => console.log('Button pressed')} size="large" />
    </>
  ),
};
