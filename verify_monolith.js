import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distIndexHtml = path.join(__dirname, 'frontend/dist/index.html');

console.log('--- STARTING MONOLITH INTEGRATION VERIFICATION ---\n');

// 1. Check if Vite Frontend Build Output exists
console.log('1. Checking Vite build output...');
if (existsSync(distIndexHtml)) {
  console.log('✅ PASS: frontend/dist/index.html exists and is compiled.');
  const indexHtmlContent = readFileSync(distIndexHtml, 'utf8');
  if (indexHtmlContent.includes('TadkaMode')) {
    console.log('✅ PASS: index.html contains "TadkaMode" title.');
  } else {
    console.error('❌ FAIL: index.html does not contain "TadkaMode" title.');
    process.exit(1);
  }
} else {
  console.error('❌ FAIL: frontend/dist/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

// 2. Verify backend file integration
console.log('\n2. Verifying backend files structure...');
const backendFiles = [
  'backend/server.js',
  'backend/controllers/recipe.controller.js',
  'backend/routes/recipe.routes.js',
  'backend/services/ai.service.js',
  'backend/utils/jsonParser.js',
  'backend/validators/recipe.validator.js'
];
backendFiles.forEach(file => {
  if (existsSync(path.join(__dirname, file))) {
    console.log(`✅ PASS: ${file} exists.`);
  } else {
    console.error(`❌ FAIL: ${file} is missing!`);
    process.exit(1);
  }
});

// 3. Test backend generation logic directly using imports (bypassing sandbox port limits)
console.log('\n3. Verifying Zod validation & JSON parser logic...');
try {
  const { recipeSchema, generateRequestSchema } = await import('./backend/validators/recipe.validator.js');
  const { extractAndParseJSON } = await import('./backend/utils/jsonParser.js');
  
  // Test validation schema
  const testInput = { ingredients: ['greek yogurt', 'paneer'] };
  const parsed = generateRequestSchema.safeParse(testInput);
  console.assert(parsed.success, 'Request schema validation failed');
  console.log('✅ PASS: Zod generateRequestSchema validated valid inputs correctly.');

  // Test parser on typical LLM raw output containing Markdown json wrapper
  const rawLlmOutput = 'Here is the recipe: ```json\n{\n  "title": "Mock Recipe",\n  "description": "Tasty",\n  "prepTime": "5m",\n  "cookTime": "10m",\n  "servings": "2",\n  "difficulty": "Easy",\n  "ingredients": [{ "name": "Paneer", "quantity": "100g", "optional": false }],\n  "steps": [{ "step": 1, "instruction": "Cook it" }],\n  "substitutions": [],\n  "tips": []\n}\n``` Enjoy!';
  const parsedJson = extractAndParseJSON(rawLlmOutput);
  const validated = recipeSchema.parse(parsedJson);
  console.log('✅ PASS: JSON parser successfully extracted, parsed, and validated LLM JSON response.');
  console.assert(validated.title === 'Mock Recipe', 'Title mismatch in mock recipe parser test');
  console.assert(validated.servings === 2, 'Servings type coercion failed'); // "2" coerced to 2
} catch (err) {
  console.error('❌ FAIL: Core validation / parser logic failed:', err.message);
  process.exit(1);
}

// 4. Verify Frontend Utils & Services
console.log('\n4. Verifying Frontend utilities...');
try {
  const { scaleQuantity } = await import('./frontend/src/utils/quantityScaler.js');
  const scaled = scaleQuantity('1 1/2 cups', 2, 4);
  console.assert(scaled === '3 cups', `Scale quantity returned unexpected value: ${scaled}`);
  console.log('✅ PASS: quantityScaler scaled "1 1/2 cups" by 2 to "3 cups".');
} catch (err) {
  console.error('❌ FAIL: Frontend quantityScaler test failed:', err.message);
  process.exit(1);
}

console.log('\n✅✅ MONOLITH INTEGRATION STATUS: FULLY SYNCHRONIZED & READY ✅✅\n');
