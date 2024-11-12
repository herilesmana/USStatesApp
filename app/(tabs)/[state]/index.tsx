// app/(tabs)/[state]/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

export default function StateDetails() {
  const { state } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [population, setPopulation] = useState(null);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const locationResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: `${state}, USA`,
            format: 'json',
          },
        });
        const populationResponse = await axios.get('https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest');
        const stateData = populationResponse.data.data.find((item) => item.State === state);

        if (locationResponse.data.length > 0) {
          const loc = locationResponse.data[0];
          setLocation({
            latitude: parseFloat(loc.lat),
            longitude: parseFloat(loc.lon),
            latitudeDelta: 5,
            longitudeDelta: 5,
          });
        }

        setPopulation(stateData ? stateData.Population : "Unknown");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStateData();
  }, [state]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{state}</Text>
      <Text style={styles.subtitle}>Population: {population.toLocaleString()}</Text>
      {location && (
        <MapView style={styles.map} region={location}>
          <Marker coordinate={location} title={state} />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
});
