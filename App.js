/**
 * Foodie — final project for Coursera course
 * "React Native: Developing Android and iOS Apps"
 *
 * Expo-compatible React Native app.
 * Run: npx expo start   (or import into Snack at https://snack.expo.dev)
 */
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ------------------------------------------------------------------ */
/* Data                                                              */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
  { id: "dessert", name: "Dessert" },
  { id: "snacks", name: "Snacks" },
];

const RECIPES = [
  {
    id: "r1",
    name: "Classic Pancakes",
    category: "breakfast",
    time: 15,
    servings: 4,
    calories: 260,
    difficulty: "Easy",
    emoji: "🥞",
    ingredients: [
      "2 cups flour",
      "2 tbsp sugar",
      "1.5 tsp baking powder",
      "2 cups milk",
      "1 egg",
      "3 tbsp butter, melted",
    ],
    steps: [
      "Whisk dry ingredients together.",
      "Beat in egg, milk and melted butter until smooth.",
      "Cook on a greased pan over medium heat, 1–2 min per side.",
      "Stack and serve with your favorite topping.",
    ],
  },
  {
    id: "r2",
    name: "Avocado Toast",
    category: "breakfast",
    time: 10,
    servings: 1,
    calories: 310,
    difficulty: "Easy",
    emoji: "🥑",
    ingredients: [
      "1 slice sourdough bread",
      "1 ripe avocado",
      "0.5 lemon, juiced",
      "Chili flakes and salt",
    ],
    steps: [
      "Toast the bread until golden.",
      "Mash avocado with lemon juice and salt.",
      "Spread on toast, top with chili flakes.",
    ],
  },
  {
    id: "r3",
    name: "Grilled Chicken Bowl",
    category: "lunch",
    time: 25,
    servings: 2,
    calories: 420,
    difficulty: "Medium",
    emoji: "🍗",
    ingredients: [
      "400 g chicken breast",
      "2 cups basmati rice",
      "1 zucchini, sliced",
      "1 bell pepper",
      "2 tbsp olive oil",
      "Lemon-garlic marinade",
    ],
    steps: [
      "Marinate chicken in lemon-garlic for 15 minutes.",
      "Grill chicken 5–6 min per side.",
      "Cook rice and sauté vegetables in olive oil.",
      "Slice chicken and arrange over the rice and vegetables.",
    ],
  },
  {
    id: "r4",
    name: "Margherita Flatbread",
    category: "lunch",
    time: 30,
    servings: 2,
    calories: 380,
    difficulty: "Medium",
    emoji: "🍕",
    ingredients: [
      "2 flatbreads",
      "1 cup mozzarella",
      "1 cup tomato sauce",
      "Fresh basil",
      "Olive oil",
    ],
    steps: [
      "Spread tomato sauce over flatbread.",
      "Top with mozzarella and a drizzle of oil.",
      "Bake at 220°C for 8–10 minutes.",
      "Finish with basil leaves.",
    ],
  },
  {
    id: "r5",
    name: "Spaghetti Bolognese",
    category: "dinner",
    time: 40,
    servings: 4,
    calories: 520,
    difficulty: "Medium",
    emoji: "🍝",
    ingredients: [
      "400 g ground beef",
      "1 onion, diced",
      "2 garlic cloves, minced",
      "1 cup tomato passata",
      "400 g spaghetti",
      "Parmesan and basil",
    ],
    steps: [
      "Sauté onion and garlic until soft.",
      "Brown the beef, add passata, simmer 20 min.",
      "Boil spaghetti al dente.",
      "Serve with sauce, parmesan and basil.",
    ],
  },
  {
    id: "r6",
    name: "Veggie Stir-fry",
    category: "dinner",
    time: 20,
    servings: 2,
    calories: 340,
    difficulty: "Easy",
    emoji: "🥘",
    ingredients: [
      "2 cups mixed vegetables",
      "3 tbsp soy sauce",
      "1 tbsp honey",
      "1 tsp sesame oil",
      "2 cups noodles",
    ],
    steps: [
      "Stir-fry vegetables on high heat, 4–5 min.",
      "Mix soy sauce, honey and sesame oil.",
      "Combine with cooked noodles and serve hot.",
    ],
  },
  {
    id: "r7",
    name: "Banana Smoothie Bowl",
    category: "dessert",
    time: 10,
    servings: 1,
    calories: 290,
    difficulty: "Easy",
    emoji: "🍌",
    ingredients: [
      "2 frozen bananas",
      "0.5 cup milk",
      "1 tbsp granola",
      "Fresh berries",
      "Chia seeds",
    ],
    steps: [
      "Blend bananas and milk until thick.",
      "Pour into a bowl, top with granola, berries and chia.",
    ],
  },
  {
    id: "r8",
    name: "Dark Chocolate Mousse",
    category: "dessert",
    time: 15,
    servings: 4,
    calories: 210,
    difficulty: "Easy",
    emoji: "🍫",
    ingredients: [
      "100 g dark chocolate",
      "3 eggs, separated",
      "2 tbsp sugar",
      "Pinch of salt",
    ],
    steps: [
      "Melt chocolate and let it cool.",
      "Fold in stiffly beaten egg whites with sugar.",
      "Chill at least 1 hour before serving.",
    ],
  },
  {
    id: "r9",
    name: "Homemade Hummus",
    category: "snacks",
    time: 10,
    servings: 4,
    calories: 180,
    difficulty: "Easy",
    emoji: "🥙",
    ingredients: [
      "1 can chickpeas",
      "3 tbsp tahini",
      "1 lemon, juiced",
      "1 garlic clove",
      "Olive oil and cumin",
    ],
    steps: [
      "Blend chickpeas with tahini, lemon and garlic.",
      "Drizzle with water until smooth.",
      "Serve with olive oil and cumin.",
    ],
  },
  {
    id: "r10",
    name: "Trail Mix",
    category: "snacks",
    time: 5,
    servings: 2,
    calories: 320,
    difficulty: "Easy",
    emoji: "🥜",
    ingredients: [
      "1 cup mixed nuts",
      "0.5 cup dried fruit",
      "0.5 cup popcorn",
      "1 tbsp chocolate chips",
    ],
    steps: [
      "Combine all ingredients in a bowl.",
      "Store in an airtight container.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Context                                                           */
/* ------------------------------------------------------------------ */

const FoodieContext = React.createContext(null);

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const f = await AsyncStorage.getItem("foodie:favorites");
        const m = await AsyncStorage.getItem("foodie:myRecipes");
        setFavorites(f ? JSON.parse(f) : []);
        setMyRecipes(m ? JSON.parse(m) : []);
      } catch (e) {
        /* ignore storage errors */
      }
      setReady(true);
    })();
  }, []);

  const toggleFavorite = (id) => {
    const isFav = favorites.includes(id);
    const next = isFav ? favorites.filter((x) => x !== id) : [...favorites, id];
    setFavorites(next);
    AsyncStorage.setItem("foodie:favorites", JSON.stringify(next));
  };

  const addRecipe = (recipe) => {
    const next = [...myRecipes, recipe];
    setMyRecipes(next);
    AsyncStorage.setItem("foodie:myRecipes", JSON.stringify(next));
  };

  const deleteRecipe = (id) => {
    const next = myRecipes.filter((r) => r.id !== id);
    setMyRecipes(next);
    AsyncStorage.setItem("foodie:myRecipes", JSON.stringify(next));
  };

  return (
    <FoodieContext.Provider
      value={{
        favorites,
        toggleFavorite,
        myRecipes,
        addRecipe,
        deleteRecipe,
        ready,
      }}
    >
      {children}
    </FoodieContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Small components                                                  */
/* ------------------------------------------------------------------ */

function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={{width: 60}} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{width: 60}} />
    </View>
  );
}

function RecipeCard({ recipe, onPress, isFav, onToggleFav }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <Text style={{fontSize: 36}}>{recipe.emoji}</Text>
        {onToggleFav ? (
          <TouchableOpacity onPress={onToggleFav} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Text style={{fontSize: 22}}>{isFav ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.cardTitle}>{recipe.name}</Text>
      <Text style={styles.cardMeta}>
        {recipe.time} min · {recipe.calories} kcal · {recipe.difficulty}
      </Text>
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/* Screens                                                           */
/* ------------------------------------------------------------------ */

function HomeScreen({ onOpenRecipe, onOpenScreen }) {
  const ctx = useContext(FoodieContext);
  const [category, setCategory] = useState("all");

  const allRecipes = ctx ? [...RECIPES, ...ctx.myRecipes] : RECIPES;
  const visible =
    category === "all"
      ? allRecipes
      : allRecipes.filter((r) => r.category === category);

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Foodie" />
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.categoryRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCategory(item.id)}
            style={[styles.chip, category === item.id && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === item.id && styles.chipTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      {ctx?.ready && (
        <FlatList
          data={visible}
          keyExtractor={(r) => r.id}
          numColumns={2}
          contentContainerStyle={{padding: 12}}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              isFav={ctx.favorites.includes(item.id)}
              onToggleFav={() => ctx.toggleFavorite(item.id)}
              onPress={() => onOpenRecipe(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function RecipeDetailScreen({ id, allRecipes, onBack, isCustom }) {
  const ctx = useContext(FoodieContext);
  const recipe = allRecipes.find((r) => r.id === id);
  if (!recipe) return null;
  const isFav = ctx ? ctx.favorites.includes(id) : false;

  return (
    <SafeAreaView style={styles.flex}>
      <Header title={recipe.name} onBack={onBack} />
      <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 48}}>
        <Text style={{fontSize: 56, textAlign: "center"}}>{recipe.emoji}</Text>
        <View style={styles.infoRow}>
          <InfoBadge label="Time" value={`${recipe.time} min`} />
          <InfoBadge label="Calories" value={`${recipe.calories}`} />
          <InfoBadge label="Difficulty" value={recipe.difficulty} />
        </View>
        {ctx && !isCustom ? (
          <TouchableOpacity onPress={() => ctx.toggleFavorite(id)} style={styles.favBtn}>
            <Text style={styles.favBtnText}>{isFav ? "❤️ Remove from favorites" : "🤍 Add to favorites"}</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ing, i) => (
          <Text key={i} style={styles.listRow}>• {ing}</Text>
        ))}
        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.steps.map((s, i) => (
          <Text key={i} style={styles.stepRow}>{i + 1}. {s}</Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoBadge({ label, value }) {
  return (
    <View style={styles.infoBadge}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function FavoritesScreen({ allRecipes, onOpenRecipe, onBack }) {
  const ctx = useContext(FoodieContext);
  if (!ctx) return null;
  const favRecipes = allRecipes.filter((r) => ctx.favorites.includes(r.id));
  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Favorites" onBack={onBack} />
      {favRecipes.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet — tap 🤍 on any recipe.</Text>
      ) : (
        <FlatList
          data={favRecipes}
          keyExtractor={(r) => r.id}
          numColumns={2}
          contentContainerStyle={{padding: 12}}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              isFav
              onToggleFav={() => ctx.toggleFavorite(item.id)}
              onPress={() => onOpenRecipe(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function AddRecipeScreen({ onSaved, onBack }) {
  const ctx = useContext(FoodieContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("lunch");
  const [time, setTime] = useState("15");
  const [calories, setCalories] = useState("300");
  const [difficulty, setDifficulty] = useState("Easy");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const save = () => {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please give your recipe a name.");
      return;
    }
    const recipe = {
      id: "custom-" + Date.now(),
      name: name.trim(),
      category,
      time: parseInt(time) || 15,
      calories: parseInt(calories) || 0,
      difficulty,
      emoji: "🍽️",
      ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    ctx.addRecipe(recipe);
    onSaved();
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Add New Recipe" onBack={onBack} />
      <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 48}}>
        <Field label="Recipe name" value={name} onChange={setName} />
        <Field label="Category" value={category} onChange={setCategory} options={CATEGORIES.filter((c) => c.id !== "all")} optionText />
        <Field label="Time (minutes)" value={time} onChange={setTime} numeric />
        <Field label="Calories" value={calories} onChange={setCalories} numeric />
        <Field label="Difficulty" value={difficulty} onChange={setDifficulty} options={["Easy", "Medium", "Hard"]} optionText />
        <Field label="Ingredients (one per line)" value={ingredients} onChange={setIngredients} multiline />
        <Field label="Steps (one per line)" value={steps} onChange={setSteps} multiline />
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>Save Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, numeric, multiline, options, optionText }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {options ? (
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => {
            const i = options.findIndex((o) => (optionText ? o.name : o) === value);
            const next = options[(i + 1) % options.length];
            onChange(optionText ? next.name : next);
          }}
        >
          <Text style={styles.selectText}>{value}  ▾</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          keyboardType={numeric ? "number-pad" : "default"}
          multiline={!!multiline}
          placeholderTextColor="#999"
        />
      )}
    </View>
  );
}

function MyFoodScreen({ onOpenRecipe, onAdd, onBack }) {
  const ctx = useContext(FoodieContext);
  if (!ctx) return null;
  return (
    <SafeAreaView style={styles.flex}>
      <Header title="My Food" onBack={onBack} />
      <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
        <Text style={styles.addBtnText}>+ Add New Recipe</Text>
      </TouchableOpacity>
      {ctx.myRecipes.length === 0 ? (
        <Text style={styles.emptyText}>Your recipes will appear here.</Text>
      ) : (
        <FlatList
          data={ctx.myRecipes}
          keyExtractor={(r) => r.id}
          numColumns={2}
          contentContainerStyle={{padding: 12}}
          renderItem={({ item }) => (
            <View>
              <RecipeCard recipe={item} onPress={() => onOpenRecipe(item.id)} />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => ctx.deleteRecipe(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                              */
/* ------------------------------------------------------------------ */

function AppInner() {
  const ctx = useContext(FoodieContext);
  const [screen, setScreen] = useState("home");
  const [recipeId, setRecipeId] = useState(null);
  const allRecipes = ctx ? [...RECIPES, ...ctx.myRecipes] : RECIPES;

  const openRecipe = (id) => {
    setRecipeId(id);
    setScreen("recipe");
  };

  let body = null;
  if (screen === "recipe") {
    body = (
      <RecipeDetailScreen
        id={recipeId}
        allRecipes={allRecipes}
        isCustom={!!recipeId && recipeId.startsWith("custom-")}
        onBack={() => setScreen("home")}
      />
    );
  } else if (screen === "favorites") {
    body = <FavoritesScreen allRecipes={allRecipes} onOpenRecipe={openRecipe} onBack={() => setScreen("home")} />;
  } else if (screen === "addRecipe") {
    body = <AddRecipeScreen onBack={() => setScreen("myFood")} onSaved={() => setScreen("myFood")} />;
  } else if (screen === "myFood") {
    body = <MyFoodScreen onOpenRecipe={openRecipe} onAdd={() => setScreen("addRecipe")} onBack={() => setScreen("home")} />;
  } else {
    body = <HomeScreen onOpenRecipe={openRecipe} onOpenScreen={setScreen} />;
  }

  return (
    <View style={styles.flex}>
      {body}
      <View style={styles.bottomNav}>
        <BottomBtn label="🏠" title="Home" active={screen === "home" || screen === "recipe"} onPress={() => setScreen("home")} />
        <BottomBtn label="❤️" title="Favorites" active={screen === "favorites"} onPress={() => setScreen("favorites")} />
        <BottomBtn label="🍽️" title="My Food" active={screen === "myFood" || screen === "addRecipe"} onPress={() => setScreen("myFood")} />
      </View>
    </View>
  );
}

function BottomBtn({ label, title, active, onPress }) {
  return (
    <TouchableOpacity style={styles.bottomBtn} onPress={onPress}>
      <Text style={{fontSize: 20}}>{label}</Text>
      <Text style={[styles.bottomBtnText, active && styles.bottomBtnTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <AppInner />
    </FavoritesProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                            */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: "#fff"},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {fontSize: 18, fontWeight: "700"},
  backBtn: {width: 60},
  backText: {fontSize: 14, fontWeight: "600", color: "#4f46e5"},
  categoryRow: {paddingHorizontal: 12, paddingVertical: 10, gap: 8},
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f1f1f5",
  },
  chipActive: {backgroundColor: "#4f46e5"},
  chipText: {color: "#333"},
  chipTextActive: {color: "#fff", fontWeight: "700"},
  card: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 12,
    margin: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTop: {flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8},
  cardTitle: {fontSize: 15, fontWeight: "700"},
  cardMeta: {fontSize: 12, color: "#888", marginTop: 4},
  infoRow: {flexDirection: "row", justifyContent: "space-around", marginVertical: 16},
  infoBadge: {alignItems: "center", backgroundColor: "#f5f4ff", borderRadius: 12, padding: 10, minWidth: 90},
  infoLabel: {fontSize: 11, color: "#777", marginBottom: 2},
  infoValue: {fontSize: 14, fontWeight: "700"},
  favBtn: {marginVertical: 12},
  favBtnText: {fontSize: 15, fontWeight: "600"},
  sectionTitle: {fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 6},
  listRow: {fontSize: 14, paddingVertical: 3, color: "#333"},
  stepRow: {fontSize: 14, paddingVertical: 3, color: "#333", marginVertical: 4},
  field: {marginBottom: 14},
  fieldLabel: {fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6},
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    minHeight: 34,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  selectText: {fontSize: 14},
  saveBtn: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {color: "#fff", fontWeight: "700", fontSize: 15},
  emptyText: {textAlign: "center", color: "#999", marginTop: 40},
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  bottomBtn: {flex: 1, alignItems: "center"},
  bottomBtnText: {fontSize: 11, color: "#777"},
  bottomBtnTextActive: {color: "#4f46e5", fontWeight: "700"},
  addBtn: {
    backgroundColor: "#4f46e5",
    margin: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  addBtnText: {color: "#fff", fontWeight: "700"},
  deleteBtn: {alignItems: "center", marginTop: 4},
  deleteText: {color: "#e11d48", fontSize: 12, fontWeight: "600"},
});
