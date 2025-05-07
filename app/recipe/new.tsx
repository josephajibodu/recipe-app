import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ORANGE } from "../../constants/Colors";

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
  const [imageUrl, setImageUrl] = useState("");
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

  const handleSave = () => {
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
    // Here you would save to your backend or state
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Recipe saved!");
      router.back();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.heading}>Add a New Recipe</ThemedText>
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
        <TextInput
          style={styles.input}
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholderTextColor="#bbb"
        />
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: ORANGE,
    marginBottom: 18,
    textAlign: "center",
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
