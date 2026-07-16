import http from 'http';

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api/recipes`;

console.log('--- STARTING ALL-ENDPOINT INTEGRATION TESTS ---');

// Helper to make HTTP requests returning promises
const makeRequest = (url, method, payload = null) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: json
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
};

const runSuite = async () => {
  try {
    // 1. Verify GET /mock
    console.log('\n1. Testing GET /mock...');
    const mockRes = await makeRequest(`${BASE_URL}/mock`, 'GET');
    if (mockRes.statusCode === 200 && mockRes.body.status === 'success') {
      console.log('✅ PASS: Mock recipe fetched. Title:', mockRes.body.data.recipe.title);
    } else {
      console.log('❌ FAIL: Mock endpoint returned status:', mockRes.statusCode, mockRes.body);
    }

    // 2. Verify POST /generate Validation Failures
    console.log('\n2. Testing POST /generate with invalid empty body...');
    const failRes = await makeRequest(`${BASE_URL}/generate`, 'POST', {});
    if (failRes.statusCode === 400 && failRes.body.status === 'fail') {
      console.log('✅ PASS: Caught validation failure correctly. Message:', failRes.body.message);
    } else {
      console.log('❌ FAIL: Expected 400 Bad Request, got:', failRes.statusCode, failRes.body);
    }

    // 3. Verify POST /generate Live AI & DB Save
    console.log('\n3. Testing POST /generate with live ingredients (calling Groq Llama 3.3 and saving to MongoDB Atlas)...');
    console.log('   (This can take 2-4 seconds for model completion)...');
    const genRes = await makeRequest(`${BASE_URL}/generate`, 'POST', {
      ingredients: ['eggs', 'tomatoes', 'onions', 'green chilies', 'butter']
    });

    if (genRes.statusCode === 200 && genRes.body.status === 'success') {
      console.log('✅ PASS: Live AI recipe generated and validated! Title:', genRes.body.data.recipe.title);
      console.log('   Ingredients count:', genRes.body.data.recipe.ingredients.length);
      console.log('   Steps count:', genRes.body.data.recipe.steps.length);
    } else {
      console.log('❌ FAIL: Live AI generation failed. Status:', genRes.statusCode, genRes.body);
      return; // Stop if AI generation fails
    }

    // 4. Verify GET /history fetches from Atlas
    console.log('\n4. Testing GET /history (fetching database history list)...');
    const histRes = await makeRequest(`${BASE_URL}/history`, 'GET');
    let generatedRecipeId = null;

    if (histRes.statusCode === 200 && histRes.body.status === 'success') {
      const list = histRes.body.data.recipes;
      console.log(`✅ PASS: History fetched. Count: ${list.length}`);
      
      // Look for our newly generated recipe in history list
      const latest = list[0]; // should be newest due to sort
      if (latest) {
        generatedRecipeId = latest._id;
        console.log('   Newest saved recipe in MongoDB:', latest.title, `(ID: ${generatedRecipeId})`);
      }
    } else {
      console.log('❌ FAIL: History endpoint failed. Status:', histRes.statusCode, histRes.body);
    }

    // 5. Verify GET /history/:id pulls full details
    if (generatedRecipeId) {
      console.log(`\n5. Testing GET /history/:id for ID: ${generatedRecipeId}...`);
      const detailRes = await makeRequest(`${BASE_URL}/history/${generatedRecipeId}`, 'GET');
      if (detailRes.statusCode === 200 && detailRes.body.status === 'success') {
        const fullRecipe = detailRes.body.data.recipe;
        console.log('✅ PASS: Full recipe detail fetched. Title:', fullRecipe.title);
        console.log('   Number of instructions:', fullRecipe.steps.length);
        console.log('   Number of substitutions:', fullRecipe.substitutions.length);
      } else {
        console.log('❌ FAIL: Failed to fetch single recipe. Status:', detailRes.statusCode, detailRes.body);
      }
    } else {
      console.log('⚠️ SKIP: Cannot test detail lookup (no recipe ID from history).');
    }

    // 6. Verify GET /history/invalid_id raises 400 Bad Request
    console.log('\n6. Testing GET /history/invalid_id (checking MongoDB ObjectId validation)...');
    const invalidIdRes = await makeRequest(`${BASE_URL}/history/abc123notanobjectid`, 'GET');
    if (invalidIdRes.statusCode === 400 && invalidIdRes.body.status === 'fail') {
      console.log('✅ PASS: Caught invalid ObjectId. Message:', invalidIdRes.body.message);
    } else {
      console.log('❌ FAIL: Expected 400 for bad ID, got:', invalidIdRes.statusCode, invalidIdRes.body);
    }

    console.log('\n--- ALL-ENDPOINT INTEGRATION TESTS COMPLETE ---');

  } catch (error) {
    console.error('Fatal test execution error:', error);
  }
};

runSuite();
