import dotenv from 'dotenv';
import { generateRecipeFromAI } from './services/ai.service.js';

dotenv.config();

console.log('--- STARTING AI SERVICE TEST ---');
console.log('Environment variables loaded:');
console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

const sampleIngredients = ['rice', 'onion', 'tomatoes', 'cheese', 'mushrooms'];

const runTest = async () => {
  try {
    console.log(`\nCalling generateRecipeFromAI with ingredients: ${JSON.stringify(sampleIngredients)}`);
    const recipe = await generateRecipeFromAI(sampleIngredients);
    console.log('\n✅ AI GENERATION TEST SUCCESS!');
    console.log(JSON.stringify(recipe, null, 2));
  } catch (error) {
    console.error('\n❌ AI GENERATION TEST FAILED!');
    console.error('Error Code:', error.statusCode || 'N/A');
    console.error('Message:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
};

runTest();
