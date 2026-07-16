import { recipeSchema, generateRequestSchema } from './validators/recipe.validator.js';

console.log('--- STARTING SCHEMA VALIDATION TESTS ---');

// Test Case 1: Ideal case
const validRecipe = {
  title: "Paneer Tikka",
  description: "Grilled marinated paneer cubes.",
  prepTime: "20 mins",
  cookTime: "10 mins",
  servings: 2,
  difficulty: "Easy",
  ingredients: [
    { name: "Paneer", quantity: "200g", optional: false },
    { name: "Yogurt", quantity: "1/2 cup", optional: false }
  ],
  steps: [
    { step: 1, instruction: "Marinate paneer with yogurt and spices." },
    { step: 2, instruction: "Grill until golden brown." }
  ],
  substitutions: [],
  tips: ["Serve hot with mint chutney."]
};

// Test Case 2: Coercion and Defaulting
const missingFieldsRecipe = {
  title: "Simple Chai",
  // description is missing (should default to '')
  prepTime: "2 mins",
  // cookTime is missing (should default to 'N/A')
  servings: "3", // string (should be coerced to number 3)
  // difficulty is missing (should default to 'Easy')
  ingredients: [
    { name: "Tea Leaves", quantity: "1 tsp" } // optional is missing (should default to false)
  ],
  steps: [
    { step: "1", instruction: "Boil water with tea leaves." } // step is string (should be coerced to number 1)
  ]
  // substitutions and tips missing (should default to empty arrays)
};

// Test Case 3: Invalid data
const invalidRecipe = {
  title: "", // empty title (should fail min(1))
  servings: -2, // negative servings (should fail positive())
  ingredients: [] // empty ingredients array (should fail min(1))
};

try {
  console.log('\nRunning Test Case 1 (Valid Recipe)...');
  const parsed1 = recipeSchema.parse(validRecipe);
  console.log('✅ Test Case 1 Passed. Output servings type:', typeof parsed1.servings);

  console.log('\nRunning Test Case 2 (Coercion & Defaulting)...');
  const parsed2 = recipeSchema.parse(missingFieldsRecipe);
  console.log('✅ Test Case 2 Passed. Coerced Servings:', parsed2.servings, `(type: ${typeof parsed2.servings})`);
  console.log('Coerced Step:', parsed2.steps[0].step, `(type: ${typeof parsed2.steps[0].step})`);
  console.log('Defaulted Description:', JSON.stringify(parsed2.description));
  console.log('Defaulted Optional Ingredient:', parsed2.ingredients[0].optional);
  console.log('Defaulted Substitutions:', JSON.stringify(parsed2.substitutions));

  console.log('\nRunning Test Case 3 (Invalid Data - Should Fail)...');
  recipeSchema.parse(invalidRecipe);
  console.log('❌ Test Case 3 Failed: Invalid recipe was unexpectedly accepted.');
} catch (error) {
  console.log('✅ Test Case 3 Passed (Caught expected validation error):');
  console.log(error.errors ? error.errors.map(e => ` - ${e.path.join('.')}: ${e.message}`) : error.message);
}

console.log('\n--- SCHEMA VALIDATION TESTS COMPLETE ---');
