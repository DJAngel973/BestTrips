const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");

// Function to retrieve data from JSON using the fetch API
async function getTravelRecommendations() {
    try {
        // Fetch API to retrieve data from the JSON file
        const response = await fetch('travel_recommendation_api.json');
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Convert the response to JSON
        const data = await response.json();

        // Display all data in console
        console.log('Full JSON data:' , data);

        // Show countries and cities
        console.log('======= COUNTRIES AND CITIES =======');
        data.countries.forEach(country => {
            console.log(`Country: ${country.name}`);
            country.cities.forEach(city => {
                console.log(`  - Country: ${city.name}`);
                console.log(`    Description: ${city.description}`);
            });
        });

        // Show temples
        console.log('======= TEMPLES =======');
        data.temples.forEach(temple => {
            console.log(`Temple: ${temple.name}`);
            console.log(`Description: ${temple.description}`);
        });

        // Show beaches
        console.log('======= BIACHES =======');
        data.beaches.forEach(beach => {
            console.log(`Biache: ${beach.name}`);
            console.log(`Description: ${beach.description}`);
        });
        return data;
    } catch (error) {
        console.log('Error loading data:', error);
        return null;
    }
}