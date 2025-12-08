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
// Function to search for specific places
function searchDestinations(data, searchTerm) {
    const results = [];
    const search = searchTerm.toLowerCase();
    // search by country and city
    data.countries.forEach(country => {
        if (country.name.toLowerCase().includes(search)) {
            results.push({
                type: 'country',
                name: country.name,
                cities: country.cities
            });
        }
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(search)) {
                results.push({
                    type: 'city',
                    name: city.name,
                    description: city.description,
                    imageUrl: city.imageUrl
                });
            }
        });
    });
    // Search in temples
    data.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(search)) {
            results.push({
                type: 'temple',
                name: temple.name,
                description: temple.description,
                imageUrl: temple.imageUrl
            });
        }
    });
    // Search in beaches
    data.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(search)) {
            results.push({
                type: 'beach',
                name: beach.name,
                description: beach.description,
                imageUrl:beach.imageUrl
            });
        }
    });
    return results;

    // Function to load data when the page loads
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('Loading travel data...');
        // Get data from JSON
        const travelData = await getTravelRecommendations();
        if (travelData) {
            console.log('Data successfully loaded!');
        }
    });
}