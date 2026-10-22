# Foodie 🍳

Final project for the Coursera course **“React Native: Developing Android and iOS Apps”** (SkillUp).

A recipe discovery app built with React Native + Expo.

## Features

- **Main feed** with a horizontal category bar (Breakfast, Lunch, Dinner, Dessert, Snacks) — the feed filters by the selected category.
- **Recipe details**: emoji artwork, prep time, calories, difficulty, ingredient list and step-by-step instructions.
-ros **Favorites**: heart button on every card and on the details screen; the Favorites tab lists only hearted recipes.
- **My Food**: “Add New Recipe” form (name, category, time, calories, difficulty, ingredients, steps) plus your own recipe list with a working **Delete**.
- **Persistence** of favorites and own recipes on the device with `AsyncStorage`.
- **Navigation**: back button in the header of every inner screen, bottom tab bar (Home / Favorites / My Food).

## Run it

- **Snack:** open <https://snack.expo.dev>, “Import Git repository”, paste this repo URL.
- **Locally:** `npm install` then `npx expo start`.

## Structure

```
App.js           screens, navigation state, storage-backed context
```

Screens: `HomeScreen`, `RecipeDetailScreen`, `FavoritesScreen`, `MyFoodScreen`, `AddRecipeScreen`.
