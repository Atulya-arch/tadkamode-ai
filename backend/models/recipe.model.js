import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: 'to taste' },
  optional: { type: Boolean, default: false }
}, { _id: false });

const stepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  instruction: { type: String, required: true }
}, { _id: false });

const substitutionSchema = new mongoose.Schema({
  ingredient: { type: String, required: true },
  alternatives: [{ type: String }]
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  prepTime: { type: String, default: 'N/A' },
  cookTime: { type: String, default: 'N/A' },
  servings: { type: Number, default: 2 },
  difficulty: { type: String, default: 'Easy' },
  ingredients: [ingredientSchema],
  steps: [stepSchema],
  substitutions: [substitutionSchema],
  tips: [{ type: String }],
  inputIngredients: [{ type: String, trim: true }], // The ingredients user entered to get this recipe
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

// Index to quickly search recipe history by date
recipeSchema.index({ createdAt: -1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
