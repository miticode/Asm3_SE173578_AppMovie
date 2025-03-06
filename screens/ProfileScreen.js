import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ProfileScreen = () => {
  // Seed data
  const user = {
    name: 'Vegeta',
    avatar: 'https://www.xtrafondos.com/wallpapers/dragon-ball-vegeta-ultra-ego-10714.jpg', // Placeholder image
  };

  const profiles = [
    { id: 1, name: 'Goku', avatar: 'https://images.hdqwalls.com/download/dragon-ball-son-goku-4k-bl-1080x1920.jpg' },
    { id: 2, name: 'Batman', avatar: 'https://tse3.mm.bing.net/th?id=OIP.5asUeu3qVrMOaxjSO-XlMwHaEJ&pid=Api&P=0&h=180' },
    { id: 3, name: 'Spiderman', avatar: 'https://i.pinimg.com/originals/75/ee/62/75ee62dd2cf3ded21b9c15738b0654da.jpg' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
      </View>

      {/* Profiles List */}
      <View style={styles.profilesContainer}>
        <Text style={styles.profilesTitle}>Who's watching?</Text>
        <View style={styles.profilesList}>
          {profiles.map((profile) => (
            <TouchableOpacity key={profile.id} style={styles.profileItem}>
              <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} />
              <Text style={styles.profileName}>{profile.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Profiles</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#141414', // Netflix-like dark background
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#E50914', // Netflix red accent
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profilesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  profilesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  profilesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  profileItem: {
    alignItems: 'center',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E50914', // Netflix red accent
  },
  profileName: {
    fontSize: 16,
    color: '#fff',
  },
  actionsContainer: {
    marginTop: 40,
    width: '100%',
  },
  button: {
    padding: 15,
    backgroundColor: '#E50914', // Netflix red accent
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;