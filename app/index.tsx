import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RecipeCard } from "../components/RecipeCard";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { LIGHT_ORANGE_BG, ORANGE } from "../constants/Colors";
import { mockRecipes } from "../data/mockRecipes";

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: LIGHT_ORANGE_BG }]}
    >
      <View style={{ height: insets.top }} />
      {/* Header Greeting and Add Button */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.greeting}>
            What would you like to cook today?
          </ThemedText>
        </View>
        <Link href="/recipe/new" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>
        </Link>
      </View>

      {/* Search Bar (non-functional) */}
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#bbb"
          style={{ marginLeft: 12, marginRight: 6 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your recipes"
          placeholderTextColor="#bbb"
          editable={false}
        />
      </View>

      {/* Section Title */}
      <ThemedText style={styles.sectionTitle}>Your Recipes</ThemedText>

      {/* Recipe List */}
      <FlatList
        data={mockRecipes}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} style={styles.recipeCard} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginRight: 12,
    paddingTop: 8,
  },
  addButton: {
    backgroundColor: ORANGE,
    borderRadius: 28,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: ORANGE,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 20,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  recipeCard: {
    borderRadius: 20,
    shadowColor: ORANGE,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
