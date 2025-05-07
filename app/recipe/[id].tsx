import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { mockRecipes } from "../../data/mockRecipes";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const recipe = mockRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Recipe not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <ThemedText style={styles.title}>{recipe.title}</ThemedText>
        <ThemedText style={styles.description}>{recipe.description}</ThemedText>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>Prep Time</ThemedText>
            <ThemedText style={styles.metaValue}>
              {recipe.prepTime} min
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>Cook Time</ThemedText>
            <ThemedText style={styles.metaValue}>
              {recipe.cookTime} min
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>Servings</ThemedText>
            <ThemedText style={styles.metaValue}>{recipe.servings}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
          {recipe.ingredients.map((ingredient, index) => (
            <ThemedText key={index} style={styles.listItem}>
              • {ingredient}
            </ThemedText>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Instructions</ThemedText>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <ThemedText style={styles.instructionNumber}>
                {index + 1}
              </ThemedText>
              <ThemedText style={styles.instructionText}>
                {instruction}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    width: 24,
    marginRight: 12,
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
});
