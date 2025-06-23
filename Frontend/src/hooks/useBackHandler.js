import { useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const useBackHandler = (isFocused) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', onPress: () => null, style: 'cancel' },
              {
                text: 'Logout',
                onPress: async () => {
                  await AsyncStorage.multiRemove(['token', 'userId', 'brandName']);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'RoleSelection' }],
                  });
                },
              },
            ],
            { cancelable: false }
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [isFocused, navigation])
  );
};

export default useBackHandler; 