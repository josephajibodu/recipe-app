import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Colors, ORANGE } from "../../../constants/Colors";
import { getRecipeById, updateRecipe } from "../../../data/sqlite";
import { Recipe } from "../../../types/recipe";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [calories, setCalories] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const fetchRecipe = useCallback(async () => {
    setLoading(true);
    const data = await getRecipeById(String(id));
    if (data) {
      setRecipe(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrepTime(String(data.prepTime));
      setCookTime(String(data.cookTime));
      setServings(String(data.servings));
      setCalories(String(data.calories));
      setIngredients(data.ingredients);
      setInstructions(data.instructions);
      setImageUrl(data.imageUrl);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!recipe) return;

    const updatedRecipe: Recipe = {
      ...recipe,
      title,
      description,
      prepTime: parseInt(prepTime) || 0,
      cookTime: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 0,
      calories: parseInt(calories) || 0,
      ingredients: ingredients.filter((i) => i.trim() !== ""),
      instructions: instructions.filter((i) => i.trim() !== ""),
      imageUrl: imageUrl || undefined,
      updatedAt: new Date().toISOString(),
    };

    await updateRecipe(updatedRecipe);
    router.back();
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

      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Edit Recipe</ThemedText>
        <Pressable
          style={[
            styles.saveButton,
            !title.trim() && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* Image Input */}
          <Pressable style={styles.imageInput} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#888" />
                <ThemedText style={styles.imagePlaceholderText}>
                  Add Recipe Image
                </ThemedText>
              </View>
            )}
          </Pressable>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Title</ThemedText>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Recipe title"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Brief description"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <ThemedText style={styles.label}>Prep Time (min)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="0"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <ThemedText style={styles.label}>Cook Time (min)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={cookTime}
                  onChangeText={setCookTime}
                  placeholder="0"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <ThemedText style={styles.label}>Servings</ThemedText>
                <TextInput
                  style={styles.input}
                  value={servings}
                  onChangeText={setServings}
                  placeholder="0"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <ThemedText style={styles.label}>Calories</ThemedText>
                <TextInput
                  style={styles.input}
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="0"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Ingredients</ThemedText>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={ingredient}
                    onChangeText={(text) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index] = text;
                      setIngredients(newIngredients);
                    }}
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor="#888"
                  />
                  {index > 0 && (
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => {
                        const newIngredients = ingredients.filter(
                          (_, i) => i !== index
                        );
                        setIngredients(newIngredients);
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable
                style={styles.addButton}
                onPress={() => setIngredients([...ingredients, ""])}
              >
                <Ionicons name="add-circle-outline" size={24} color={ORANGE} />
                <ThemedText style={styles.addButtonText}>
                  Add Ingredient
                </ThemedText>
              </Pressable>
            </View>

            {/* Instructions */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Instructions</ThemedText>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.listItem}>
                  <TextInput
                    style={[styles.input, styles.textArea, { flex: 1 }]}
                    value={instruction}
                    onChangeText={(text) => {
                      const newInstructions = [...instructions];
                      newInstructions[index] = text;
                      setInstructions(newInstructions);
                    }}
                    placeholder={`Step ${index + 1}`}
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={3}
                  />
                  {index > 0 && (
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => {
                        const newInstructions = instructions.filter(
                          (_, i) => i !== index
                        );
                        setInstructions(newInstructions);
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable
                style={styles.addButton}
                onPress={() => setInstructions([...instructions, ""])}
              >
                <Ionicons name="add-circle-outline" size={24} color={ORANGE} />
                <ThemedText style={styles.addButtonText}>Add Step</ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  imageInput: {
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#888",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: ORANGE,
    fontSize: 16,
    fontWeight: "500",
  },
});
