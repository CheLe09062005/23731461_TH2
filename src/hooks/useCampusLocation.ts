import { useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE } from '@constants/student';
import { useLocationStore } from '@stores/locationStore';

const KTX_LAT = 10.8221;
const KTX_LNG = 106.6868;

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useCampusLocation = () => {
  const setLocationData = useLocationStore(state => state.setLocationData);

  const fetchAndCalculate = useCallback(
    (lat: number, lng: number) => {
      const km = haversine(lat, lng, KTX_LAT, KTX_LNG);
      const fee = BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
      setLocationData('granted', km, fee);
    },
    [setLocationData],
  );

  const getLocation = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationData('denied', 0, 0);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          fetchAndCalculate(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        () => {
          setLocationData('denied', 0, 0);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (e) {
      console.log('Location Error', e);
      setLocationData('denied', 0, 0);
    }
  }, [fetchAndCalculate, setLocationData]);

  return { getLocation };
};
