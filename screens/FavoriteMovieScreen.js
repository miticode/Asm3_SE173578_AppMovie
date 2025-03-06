import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

const FavoriteMovieScreen = ({ navigation }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesJson = await AsyncStorage.getItem("favoriteMovies");
        if (favoritesJson) {
          setFavoriteMovies(JSON.parse(favoritesJson));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    // Load favorites when screen mounts and when navigating back
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    loadFavorites();

    return unsubscribe;
  }, [navigation]);

  // Function to remove a movie from favorites
  const removeFromFavorites = async (movieId) => {
    try {
      // Filter out the movie with the given ID
      const updatedFavorites = favoriteMovies.filter(movie => movie.id !== movieId);
      
      // Update AsyncStorage
      await AsyncStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
      
      // Update state
      setFavoriteMovies(updatedFavorites);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  // Confirmation dialog before removing
  const confirmRemove = (movie) => {
    Alert.alert(
      "Remove from Favorites",
      `Are you sure you want to remove "${movie.title}" from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          onPress: () => removeFromFavorites(movie.id),
          style: "destructive" 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>
      
      {favoriteMovies.length > 0 ? (
        <FlatList
          numColumns={2}
          data={favoriteMovies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.movieCard}>
              <TouchableOpacity
                onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
              >
                <Image source={{ uri: item.image }} style={styles.movieImage} />
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => confirmRemove(item)}
              >
                <Ionicons name="close-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite movies yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#000',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914', // Netflix red
  },
  movieCard: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    position: 'relative',
  },
  movieImage: {
    width: 160,
    height: 240,
    borderRadius: 8,
  },
  movieTitle: {
    marginTop: 8,
    color: '#FFF',
    textAlign: 'center',
    width: 160,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E50914', // Netflix red
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
  }
});

export default FavoriteMovieScreen;