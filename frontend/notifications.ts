import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Registra el dispositivo para recibir notificaciones push.
 * @returns Token de notificaciones o null si no se otorgan permisos.
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  let token: string | null = null;


  const isDevice = Platform.OS !== 'web' && !Constants.platform?.ios?.simulator;
  console.log(isDevice);
  if (isDevice) {
    // Solicita permisos para notificaciones
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se otorgaron permisos para notificaciones.');
      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();
    token = pushToken.data;
    console.log('Token generado:', token);
  } else {
    alert('¡Las notificaciones solo funcionan en dispositivos físicos.');
  }

  //  específica para AndroidConfiguración
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};
