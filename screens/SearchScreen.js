import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const options = {
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/search',
      params: {
        type: 'movie',
        genre: 'Drama',
        genres: ['Drama'],
        rows: '25',
        sortOrder: 'ASC',
        sortField: 'id',
        query: searchTerm
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'imdb236.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieItemContainer}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <Image 
        source={{ uri: item.primaryImage }} 
        style={styles.movieImage} 
        resizeMode="cover"
      />
      <View style={styles.movieInfoContainer}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.primaryTitle}
        </Text>
        <View style={styles.movieMetaContainer}>
          <Text style={styles.movieYear}>{item.startYear}</Text>
          <Text style={styles.movieRating}>
            {item.averageRating ? `${item.averageRating}/10` : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for movies"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Icon name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={3}
          columnWrapperStyle={styles.flatlistColumns}
          contentContainerStyle={styles.flatlistContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Find your next favorite movie
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Search for movies, series, and more
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414', // Deep black background
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333', // Dark gray background
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  flatlistColumns: {
    justifyContent: 'space-between',
  },
  flatlistContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  movieItemContainer: {
    width: (width - 48) / 3, // 3 columns with spacing
    marginBottom: 16,
  },
  movieImage: {
    width: '100%',
    height: 180,
    borderRadius: 6,
  },
  movieInfoContainer: {
    marginTop: 8,
  },
  movieTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  movieMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  movieYear: {
    color: '#888',
    fontSize: 12,
  },
  movieRating: {
    color: '#888',
    fontSize: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchScreen;