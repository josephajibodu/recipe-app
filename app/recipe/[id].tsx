import { Ionicons } from "@expo/vector-icons";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Colors, ORANGE } from "../../constants/Colors";
import { deleteRecipe, getRecipeById } from "../../data/sqlite";
import { Recipe } from "../../types/recipe";

type Tab = "ingredients" | "instructions";

const TAB_ICON = {
  ingredients: "list-outline",
  instructions: "git-branch-outline",
};

const TAB_LABEL = {
  ingredients: "Ingredients",
  instructions: "Instructions",
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("ingredients");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fetchRecipe = useCallback(async () => {
    setLoading(true);
    const data = await getRecipeById(String(id));
    setRecipe(data);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchRecipe();
    }, [fetchRecipe])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteRecipe(String(id));
            router.replace("/");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: Colors.light.lightOrangeBg },
        ]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      </ThemedView>
    );
  }

  if (!recipe) {
    return (
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: Colors.light.lightOrangeBg },
        ]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedText>Recipe not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: Colors.light.lightOrangeBg },
      ]}
    >
      <View style={{ height: insets.top + 12 }} />

      {/* Top Image with Floating Buttons */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <Pressable
          style={[styles.backButton, { top: Platform.OS === "ios" ? 54 : 24 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </Pressable>
        <View
          style={[
            styles.actionButtons,
            { top: Platform.OS === "ios" ? 54 : 24 },
          ]}
        >
          <Link href={`/recipe/edit/${id}`} asChild>
            <Pressable style={styles.editButton}>
              <Ionicons name="pencil" size={24} color={ORANGE} />
            </Pressable>
          </Link>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#ff0000" />
          </Pressable>
        </View>
      </View>

      {/* Overlay Card */}
      <View style={styles.card}>
        <ThemedText style={styles.title}>{recipe.title}</ThemedText>
        <ThemedText style={styles.description}>{recipe.description}</ThemedText>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color="#888"
              style={styles.metaIcon}
            />
            <Text style={styles.metaValue}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="people-outline"
              size={16}
              color="#888"
              style={styles.metaIcon}
            />
            <Text style={styles.metaValue}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="flame-outline"
              size={16}
              color="#888"
              style={styles.metaIcon}
            />
            <Text style={styles.metaValue}>{recipe.calories} Cal</Text>
          </View>
        </View>

        {/* Pills Tab View */}
        <View style={styles.pillTabContainer}>
          {(["ingredients", "instructions"] as Tab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[
                  styles.pillTab,
                  isActive && {
                    ...styles.pillTabActive,
                    backgroundColor: ORANGE,
                    shadowColor: ORANGE,
                  },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Ionicons
                  name={TAB_ICON[tab] as any}
                  size={18}
                  color={isActive ? "#fff" : "#888"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.pillTabText,
                    isActive && styles.pillTabTextActive,
                  ]}
                >
                  {TAB_LABEL[tab]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tab Content */}
        {activeTab === "ingredients" ? (
          <View style={styles.section}>
            {recipe.ingredients.map((ingredient, index) => (
              <ThemedText key={index} style={styles.listItem}>
                • {ingredient}
              </ThemedText>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
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
        )}
      </View>
    </ThemedView>
  );
}

const IMAGE_HEIGHT = 280;
const CARD_TOP = IMAGE_HEIGHT - 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#eee",
    marginBottom: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 24,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtons: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    gap: 12,
    zIndex: 10,
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    position: "absolute",
    top: CARD_TOP,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 2,
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
    color: ORANGE,
  },
  description: {
    fontSize: 15,
    color: "#666",
    marginBottom: 18,
    textAlign: "left",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },
  pillTabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.borderOrange,
    padding: 4,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pillTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    marginHorizontal: 4,
  },
  pillTabActive: {
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  pillTabText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "500",
  },
  pillTabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
    color: "#222",
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    width: 28,
    marginRight: 12,
    color: ORANGE,
    textAlign: "right",
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
    color: "#222",
  },
});
