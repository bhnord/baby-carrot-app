const natural = require('natural');
const fs = require('fs');
const csv = require('csv-parser');
const { Vector } = require('cosine-similarity');

// Load the CSV data
const ingredientsData = [];

fs.createReadStream('ingredients.csv')
  .pipe(csv())
  .on('data', (row) => {
    ingredientsData.push(row.ingredient);
  })
  .on('end', () => {
    // Tokenize the ingredients
    const tokenizer = new natural.WordTokenizer();
    const tokenizedIngredients = ingredientsData.map((ingredient) => tokenizer.tokenize(ingredient));

    // Create vectors for each ingredient
    const vectors = tokenizedIngredients.map((tokens) => new Vector(tokens));

    // Calculate cosine similarity
    const results = [];
    for (let i = 0; i < vectors.length; i++) {
      const similarities = [];
      for (let j = 0; j < vectors.length; j++) {
        if (i === j) {
          continue;
        }
        const similarity = vectors[i].cosineSimilarity(vectors[j]);
        similarities.push({ ingredient: ingredientsData[j], similarity });
      }
      // Sort by similarity (highest to lowest)
      similarities.sort((a, b) => b.similarity - a.similarity);
      results.push({ ingredient: ingredientsData[i], similarIngredients: similarities });
    }

    // Print the results
    results.forEach((result) => {
      console.log(`Most similar ingredients to "${result.ingredient}":`);
      result.similarIngredients.forEach((sim) => {
        console.log(`- ${sim.ingredient} (Cosine Similarity: ${sim.similarity.toFixed(2)})`);
      });
      console.log(); // Empty line for separation
    });
  });