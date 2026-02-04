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
                console.log(`  - City: ${city.name}`);
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
            console.log(`Beach: ${beach.name}`);
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
        if (country.name.toLowerCase().includes(search) && country.cities.length > 0) {
            const citiesWithData = country.cities.filter(city => city.description && city.imageUrl);
            if (citiesWithData.length > 0) {
                citiesWithData.forEach(city => {
                    results.push({
                        type: 'city',
                        name: city.name,
                        description: city.description,
                        imageUrl: city.imageUrl,
                        timeZone: country.timeZone,
                        country: country.name
                    });
                });
            }
        }
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(search) && city.description && city.imageUrl) {
                results.push({
                    type: 'city',
                    name: city.name,
                    description: city.description,
                    imageUrl: city.imageUrl,
                    timeZone: country.timeZone,
                    country: country.name
                });
            }
        });
    });
    // Search in temples
    data.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(search) && temple.description && temple.imageUrl) {
            results.push({
                type: 'temple',
                name: temple.name,
                description: temple.description,
                imageUrl: temple.imageUrl,
                timeZone: temple.timeZone,
                country: temple.name
            });
        }
    });
    // Search in beaches
    data.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(search) && beach.description && beach.imageUrl) {
            results.push({
                type: 'beach',
                name: beach.name,
                description: beach.description,
                imageUrl: beach.imageUrl,
                timeZone: beach.timeZone,
                country: beach.name
            });
        }
    });
    return results;
}

function getCountryTime(timeZone, countryName) {
    if (!timeZone) return null;
    try {
        const options = {
            timeZone: timeZone,
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'long'
        };
        const localtime = new Date().toLocaleString('en-US', options);
        return {
            time: localtime,
            location: countryName
        };
    } catch (error) {
        console.log('Invalid timezone', timeZone);
        return  null;
    }
}

// Display results function
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'block';
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try  a different search term.</p>';
        console.log('No results were found');
        return;
    }
    console.log(`${results.length} results were found:`);
    let htmlContent = ``;
    results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name} (${result.type})`);
        console.log(`     ${result.description}`);
        let timeHtml = '';
        if (result.timeZone && result.country) {
            const timeInfo = getCountryTime(result.timeZone, result.country);
            if (timeInfo) {
                timeHtml = `
                    <div class="result-time">
                        <i class="fas fa-clock"></i>
                        <span>Local time in ${timeInfo.localtion}:</span>
                        <strong>${timeInfo.time}</strong>
                    </div>
                `;
            }
        }
        htmlContent += `
            <div class="result-item">
                <img src="${result.imageUrl}" alt="${result.name}" class="result-image">
                <div class="result-content">
                    <h3 class="result-title">${result.name}</h3>
                    <span class="result-type">${result.type}</span>
                    ${timeHtml}
                    <p class="result-description">${result.description}</p>
                </div>
            </div>
        `;
    });
    resultsContainer.innerHTML = htmlContent;
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
                resultsContainer.style.display = 'none';
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