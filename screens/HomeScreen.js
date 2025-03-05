import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Button, 
  ScrollView 
} from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [topMovies, setTopMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Fetch top movies
  useEffect(() => {
    const fetchTopMovies = async () => {
      const options = {
        method: 'GET',
        url: 'https://imdb236.p.rapidapi.com/imdb/top250-movies',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setTopMovies(response.data);
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    };

    fetchTopMovies();
  }, []);

  // Fetch favorite movies
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesJson = await AsyncStorage.getItem('favoriteMovies');
        if (favoritesJson) {
          setFavoriteMovies(JSON.parse(favoritesJson));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    // Load favorites when screen mounts and when navigating back
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    loadFavorites();

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NETFLIX</Text>
        <Button
          title="Search"
          onPress={() => navigation.navigate('Search')}
          color="#E50914"
        />
      </View>

      {/* Main Content */}
      <ScrollView>
        {/* Trending Now Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList
            horizontal
            data={topMovies.slice(35, 60)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
                <Image source={{ uri: item.primaryImage }} style={styles.trendingMovieImage} />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Top 250 Movies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 250 Movies</Text>
          <FlatList
            horizontal
            data={topMovies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
                <Image source={{ uri: item.primaryImage }} style={styles.movieImage} />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Popular on Netflix Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular on Netflix</Text>
          <FlatList
            horizontal
            data={topMovies.slice(10, 20)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
                <Image source={{ uri: item.primaryImage }} style={styles.movieImage} />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* My Favorites Section */}
        {favoriteMovies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Favorites</Text>
            <FlatList
              horizontal
              data={favoriteMovies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.movieImage} 
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Màu nền tối
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000', // Màu nền header
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914', // Màu đỏ Netflix
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // Màu chữ trắng
    marginLeft: 16,
    marginBottom: 10,
  },
  trendingMovieImage: {
    width: 150,
    height: 220,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  movieImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

export default HomeScreen;