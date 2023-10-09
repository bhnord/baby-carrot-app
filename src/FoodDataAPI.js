import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FoodDataAPI.css'

function FoodDataAPI() {
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [results, setResults] = useState([]); // State for search results
  const [openResults, setOpenResults] = useState([]); // State for search results
  const [submitted, setSubmitted] = useState(false); // Track whether the form has been submitted
  const [error, setError] = useState(null); // State to track input validation error


  const API_KEY = 'SYQaggE7h9YBj0IIev6TODRVYSLdyEDjLuEugaw1';


  const handleSearch = async (e) => {
    console.log(searchTerm)

    // Clear previous error message
    setError(null);

    try {
      // Make a GET request to the FDC API's search endpoint
      const response = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchTerm}&api_key=${API_KEY}`
      );

      // Extract and set the search results from the API response
      let foods = response.data.foods;
      let foodsValid = []
      await foods.forEach((food) => {
        if(food.brandName != '' && food.brandName != null && food.gtinUpc.length ==12){
          foodsValid.push(food)
        }
      })
      setResults(foodsValid);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    try {
      // Make a GET request to the FDC API's search endpoint
      const response2 = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${searchTerm}?fields=ecoscore_data`
      );

      // Extract and set the search results from the API response
      setOpenResults(response2.data.product.ecoscore_data.agribalyse);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setSubmitted(true); // Mark the form as submitted
  };

  const ecoscore = openResults.score;

  return (
    <div className="foodDataAPI">
      <h2>Product Search</h2>
      <form onSubmit={(e) => {e.preventDefault(); handleSearch()}}>
        <input
          type="text"
          placeholder="UPC Number (barcode)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {submitted && results.length === 0 && (
        <p>Sorry, we do not currently have results for your query.</p>
      )}

      {submitted && results.length > 0 && (
        <div className='foodDescription'>

          <h3>Food Description</h3>

          {results.map((food) => {
            if (food.brandName != null && food.brandName != '' && food.gtinUpc.length == 12) {
              return (
                <div className='food' key={food.fdcId} onClick={(e) => setSearchTerm(food.gtinUpc)}>
                  <p className='brand'><strong>Brand:</strong> {food.brandName}</p>
                  <strong>Food Description:</strong> {food.description}<br />
                  <strong>Ingredients:</strong> {food.ingredients}<br />
                </div>
              )
            }
          })}
          <br></br>

        </div>
      )}

      {submitted && Object.keys(openResults).length > 0 && (
        <div>
          <h2>Open Food Facts Data</h2>
          <h3>EcoScore: {ecoscore}/100</h3>
          <h3>Estimated CO2 Emission</h3>

          <strong>CO2 from Agriculture: </strong> {openResults.co2_agriculture} kg <br></br>
          <strong>CO2 from Consumption: </strong> {openResults.co2_consumption} kg <br></br>
          <strong>CO2 from Distribution: </strong> {openResults.co2_distribution} kg <br></br>
          <strong>CO2 from Packaging: </strong> {openResults.co2_packaging} kg <br></br>
          <strong>CO2 from Processing: </strong> {openResults.co2_processing} kg <br></br>
          <strong>CO2 from Transportation: </strong> {openResults.co2_transportation} kg <br></br>
          <strong>CO2 Total: </strong> {openResults.co2_total} kg <br></br>

          {/* const listItems = openResults.map((number) =>
  <li>{number}</li>
); */}
        </div>
      )}
    </div>
  );

}

export default FoodDataAPI;
