import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoritesJson = await AsyncStorage.getItem('favoriteMovies');
        const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
        const isCurrentMovieFavorite = favorites.some(
          (movie) => movie.id === movieId
        );
        setIsFavorite(isCurrentMovieFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [movieId]);


  useEffect(() => {
    const fetchMovieDetails = async () => {
      const options = {
        method: 'GET',
        url: `https://imdb236.p.rapidapi.com/imdb/${movieId}`,
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setMovieDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);


  const toggleFavorite = async () => {
    try {
      // Retrieve current favorites
      const favoritesJson = await AsyncStorage.getItem('favoriteMovies');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter((movie) => movie.id !== movieId);
        Alert.alert('Removed', 'Movie removed from favorites');
      } else {
        // Add to favorites
        const movieToAdd = {
          id: movieId,
          title: movieDetails.primaryTitle,
          image: movieDetails.primaryImage,
          year: movieDetails.startYear,
          rating: movieDetails.averageRating
        };
        favorites.push(movieToAdd);
        Alert.alert('Added', 'Movie added to favorites');
      }

      // Save updated favorites
      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(favorites));
      
      // Update local state
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Could not update favorites');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading movie details. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {movieDetails && (
        <>
          {/* Hero Image with Gradient Overlay */}
          <View style={styles.heroImageContainer}>
            <Image 
              source={{ uri: movieDetails.primaryImage }} 
              style={styles.heroImage} 
              resizeMode="cover"
            />
           <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={toggleFavorite}
            >
              <Icon 
                name={isFavorite ? "favorite" : "favorite-border"} 
                size={30} 
                color={isFavorite ? "#E50914" : "white"} 
              />
            </TouchableOpacity>
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.playButton}>
                <Icon name="play-arrow" size={24} color="black" />
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
              <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="add" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="info-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Movie Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.movieTitle}>{movieDetails.primaryTitle}</Text>
            
            <View style={styles.movieMetaContainer}>
              <Text style={styles.movieMeta}>
                {movieDetails.startYear} • {movieDetails.averageRating}/10 
              </Text>
              <Text style={styles.movieMeta}>
                {movieDetails.genres.join(' • ')}
              </Text>
            </View>

            {/* Description */}
            <Text style={styles.movieDescription} numberOfLines={3}>
              {movieDetails.description}
            </Text>

            {/* Additional Details Section */}
            <View style={styles.additionalDetailsContainer}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Countries</Text>
                <Text style={styles.sectionContent}>
                  {movieDetails.countriesOfOrigin.join(', ')}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <Text style={styles.sectionContent}>
                  {movieDetails.spokenLanguages.join(', ')}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    favoriteButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
      },
  container: {
    flex: 1,
    backgroundColor: '#141414', // Netflix dark background
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  errorText: {
    fontSize: 16,
    color: '#E50914',
  },
  heroImageContainer: {
    width: width,
    height: height * 0.6,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  playButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  secondaryActions: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  detailsContainer: {
    padding: 15,
  },
  movieTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieMetaContainer: {
    marginBottom: 15,
  },
  movieMeta: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 5,
  },
  movieDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  additionalDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailSection: {
    flex: 1,
    marginRight: 15,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 5,
  },
  sectionContent: {
    color: 'white',
    fontSize: 15,
  },
});

export default MovieDetailScreen;