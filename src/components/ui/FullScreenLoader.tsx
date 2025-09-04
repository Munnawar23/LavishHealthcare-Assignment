import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme'; 

/**
 * Full-screen loading indicator using theme colors.
 */
const FullScreenLoader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default FullScreenLoader;
