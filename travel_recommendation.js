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
        console.log('======= BEACHES =======');
        data.beaches.forEach(beach => {
            console.log(`Beache: ${beach.name}`);
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
}

// Display results function
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('results-container') || createResultsContainer();
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try  a different search term.</p>';
        console.log('No results were found');
        return;
    }
    console.log(`${results.length} results were found:`);
    let htmlContent = `<h2>Search Results (${results.length} found):</h2>`;
    results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name} (${result.type})`);
        console.log(`     ${result.description}`);
        htmlContent += `
            <div class="result-item">
                <h3>${result.name}</h3>
                <p><strong>Type:</strong> ${result.description}</p>
                <p><strong>Description:</strong> ${result.description}</p>
                ${result.imageUrl ? `<img src="${result.imageUrl}" alt="${result.name}" style="max-width: 300px; height: auto;">` : ''}
            </div>
        `
    });
    resultsContainer.innerHTML = htmlContent;
}

//Function to create results container if it doesn't exist
function createResultsContainer() {
    const container = document.createElement('div');
    container.id = 'results-container';
    container.style.marginTop = '20px';
    container.style.padding = '20px';
    container.style.border = '1px solid  #ccc';
    container.style.borderRadius = '5px';

    // Add after search form or at the end of body
    const searchForm = document.querySelector('form') || document.body;
    searchForm.parentNode.insertBefore(container, searchForm.nextSibling);
    return container;
}

// Function to setup search functionality
function setupSearch(travelData) {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                const results = searchDestinations(travelData, searchTerm);
                console.log(`Results for "${searchTerm}":`, results);
                displaySearchResults(results);
            }
        });
    }
    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            const resultsContainer = document.getElementById(`results-container`);
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }
            console.log('Cleared search');
        });
    }
}

// Function to load data when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Loading travel data...');
    // Get data from JSON
    const travelData = await getTravelRecommendations();
    if (travelData) {
        console.log('Data successfully loaded!');
        setupSearch(travelData);
    } else {
        console.error(`Failed to load travel data`);
    }
});