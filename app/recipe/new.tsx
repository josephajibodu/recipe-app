import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { ORANGE } from "../../constants/Colors";
import { addRecipe } from "../../data/sqlite";

export default function NewRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [calories, setCalories] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddIngredient = () => setIngredients([...ingredients, ""]);
  const handleIngredientChange = (text: string, idx: number) => {
    const newArr = [...ingredients];
    newArr[idx] = text;
    setIngredients(newArr);
  };
  const handleRemoveIngredient = (idx: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleInstructionChange = (text: string, idx: number) => {
    const newArr = [...instructions];
    newArr[idx] = text;
    setInstructions(newArr);
  };
  const handleRemoveInstruction = (idx: number) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!title.trim()) return Alert.alert("Title is required");
    if (!description.trim()) return Alert.alert("Description is required");
    if (!prepTime || isNaN(Number(prepTime)))
      return Alert.alert("Prep time must be a number");
    if (!cookTime || isNaN(Number(cookTime)))
      return Alert.alert("Cook time must be a number");
    if (!servings || isNaN(Number(servings)))
      return Alert.alert("Servings must be a number");
    if (!calories || isNaN(Number(calories)))
      return Alert.alert("Calories must be a number");
    if (ingredients.some((i) => !i.trim()))
      return Alert.alert("All ingredients must be filled");
    if (instructions.some((i) => !i.trim()))
      return Alert.alert("All instructions must be filled");

    setSaving(true);
    try {
      const now = new Date().toISOString();
      await addRecipe({
        id: uuid.v4() as string,
        title: title.trim(),
        description: description.trim(),
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        calories: Number(calories),
        ingredients: ingredients.map((i) => i.trim()),
        instructions: instructions.map((i) => i.trim()),
        imageUrl: imageUrl ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
      Alert.alert("Recipe saved!");
      router.back();
    } catch (e) {
      console.log("error", e);
      Alert.alert("Error saving recipe");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.imagePickerWrapper}>
            <Pressable style={styles.imagePickerBtn} onPress={pickImage}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imagePreviewFull}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color={ORANGE} />
                </View>
              )}
            </Pressable>
            <Pressable onPress={pickImage} style={{ marginTop: 8 }}>
              <ThemedText style={styles.imagePickerText}>
                {imageUrl ? "Change Image" : "Pick an Image"}
              </ThemedText>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#bbb"
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#bbb"
            multiline
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputSmall, { flex: 1 }]}
              placeholder="Prep Time (min)"
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              placeholderTextColor="#bbb"
            />
            <TextInput
              style={[
                styles.input,
                styles.inputSmall,
                { flex: 1, marginLeft: 12 },
              ]}
              placeholder="Cook Time (min)"
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="numeric"
              placeholderTextColor="#bbb"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputSmall, { flex: 1 }]}
              placeholder="Servings"
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
              placeholderTextColor="#bbb"
            />
            <TextInput
              style={[
                styles.input,
                styles.inputSmall,
                { flex: 1, marginLeft: 12 },
              ]}
              placeholder="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholderTextColor="#bbb"
            />
          </View>
          <ThemedText style={styles.label}>Ingredients</ThemedText>
          {ingredients.map((ingredient, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={`Ingredient ${idx + 1}`}
                value={ingredient}
                onChangeText={(text) => handleIngredientChange(text, idx)}
                placeholderTextColor="#bbb"
              />
              {ingredients.length > 1 && (
                <Pressable
                  onPress={() => handleRemoveIngredient(idx)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="remove-circle" size={22} color="#e74c3c" />
                </Pressable>
              )}
            </View>
          ))}
          <Pressable onPress={handleAddIngredient} style={styles.addRowBtn}>
            <Ionicons name="add-circle" size={22} color={ORANGE} />
            <ThemedText style={styles.addRowBtnText}>Add Ingredient</ThemedText>
          </Pressable>
          <ThemedText style={styles.label}>Instructions</ThemedText>
          {instructions.map((instruction, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={`Step ${idx + 1}`}
                value={instruction}
                onChangeText={(text) => handleInstructionChange(text, idx)}
                placeholderTextColor="#bbb"
              />
              {instructions.length > 1 && (
                <Pressable
                  onPress={() => handleRemoveInstruction(idx)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="remove-circle" size={22} color="#e74c3c" />
                </Pressable>
              )}
            </View>
          ))}
          <Pressable onPress={handleAddInstruction} style={styles.addRowBtn}>
            <Ionicons name="add-circle" size={22} color={ORANGE} />
            <ThemedText style={styles.addRowBtnText}>Add Step</ThemedText>
          </Pressable>
          <Pressable
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={saving}
          >
            <Ionicons
              name="save"
              size={22}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <ThemedText style={styles.saveBtnText}>
              {saving ? "Saving..." : "Save Recipe"}
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: ORANGE,
    marginBottom: 18,
    textAlign: "center",
  },
  imagePickerWrapper: {
    alignItems: "center",
    marginBottom: 18,
    width: "100%",
  },
  imagePickerBtn: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "#FFF7F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFE1D6",
  },
  imagePreviewFull: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: ORANGE,
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
  },
  inputSmall: {
    minWidth: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginTop: 18,
    marginBottom: 6,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeBtn: {
    marginLeft: 8,
    padding: 2,
  },
  addRowBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#FFF7F3",
  },
  addRowBtnText: {
    color: ORANGE,
    fontWeight: "600",
    marginLeft: 4,
    fontSize: 15,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    borderRadius: 18,
    paddingVertical: 14,
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 32,
    shadowColor: ORANGE,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
