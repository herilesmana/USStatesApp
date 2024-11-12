// app/(tabs)/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';

const stateCodes = {
  Alabama: 'al', Alaska: 'ak', Arizona: 'az', Arkansas: 'ar', California: 'ca', Colorado: 'co',
  Connecticut: 'ct', Delaware: 'de', "District of Columbia": 'dc', Florida: 'fl', Georgia: 'ga',
  Hawaii: 'hi', Idaho: 'id', Illinois: 'il', Indiana: 'in', Iowa: 'ia', Kansas: 'ks', Kentucky: 'ky',
  Louisiana: 'la', Maine: 'me', Maryland: 'md', Massachusetts: 'ma', Michigan: 'mi', Minnesota: 'mn',
  Mississippi: 'ms', Missouri: 'mo', Montana: 'mt', Nebraska: 'ne', Nevada: 'nv', "New Hampshire": 'nh',
  "New Jersey": 'nj', "New Mexico": 'nm', "New York": 'ny', "North Carolina": 'nc', "North Dakota": 'nd',
  Ohio: 'oh', Oklahoma: 'ok', Oregon: 'or', Pennsylvania: 'pa', "Rhode Island": 'ri', "South Carolina": 'sc',
  "South Dakota": 'sd', Tennessee: 'tn', Texas: 'tx', Utah: 'ut', Vermont: 'vt', Virginia: 'va',
  Washington: 'wa', "West Virginia": 'wv', Wisconsin: 'wi', Wyoming: 'wy',
};

export default function HomeScreen() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = () => {
    setLoading(true);
    axios.get('https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest')
      .then(response => {
        setStates(response.data.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const getImageUrl = (stateName) => {
    const code = stateCodes[stateName];
    return code ? `https://flagcdn.com/w80/us-${code}.png` : null;
  };

  const filteredStates = states.filter((state) =>
    state.State.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <Link href={`/state/${item.State}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image
          style={styles.image}
          source={{ uri: getImageUrl(item.State) }}
          defaultSource={require('../../assets/images/placeholder.png')}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.State}</Text>
          <Text style={styles.subtitle}>Population: {item.Population.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search states"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredStates}
          keyExtractor={(item) => item.State}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchStates} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 4,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
});
