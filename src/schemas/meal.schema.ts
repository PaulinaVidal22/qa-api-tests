export const mealSchema = {
  type: "object",
  properties: {
    meals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          idMeal: { type: "string" },
          strMeal: { type: "string" },
          strMealThumb: { type: "string" }
        },
        required: ["idMeal", "strMeal", "strMealThumb"]
      }
    }
  },
  required: ["meals"]
};
