// Function to read CSV file
function readCSVFile(callback) {
    fetch('data.csv')
        .then(response => response.text())
        .then(csv => {
            let data = csv.split('\n').map(row => row.split(','));
            callback(data);
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

// Function to extract distinct values from a column
function getDistinctValues(data, columnIndex) {
    let distinctValues = new Set();
    for (let i = 1; i < data.length; i++) { // Start from index 1 to skip header
        distinctValues.add(data[i][columnIndex]);
    }
    return Array.from(distinctValues);
}

// Function to populate dropdown menu
function populateDropdown(dropdownId, values) {
    let dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ''; // Clear existing options
    values.forEach(value => {
        let option = document.createElement('option');
        option.text = value;
        dropdown.add(option);
    });
}

// Call readCSVFile function when the document loads
document.addEventListener('DOMContentLoaded', function() {
    readCSVFile(function(data) {
        let opponents = getDistinctValues(data, 7); // Assuming opponent column is at index 4
        let venues = getDistinctValues(data, 8);    // Assuming venue column is at index 5
        let countries = getDistinctValues(data, 9); // Assuming country column is at index 6
        
        populateDropdown('opponentDropdown', opponents);
        populateDropdown('venueDropdown', venues);
        populateDropdown('countryDropdown', countries);
    });
    
    // Event listener for opponent dropdown change
    document.getElementById('opponentDropdown').addEventListener('change', function() {
        let selectedOpponent = this.value;
        readCSVFile(function(data) {
            let venues = getDistinctValues(data.filter(row => row[4] === selectedOpponent), 5); // Filter by opponent
            populateDropdown('venueDropdown', venues);
        });
    });
    
    // Event listener for venue dropdown change
    document.getElementById('venueDropdown').addEventListener('change', function() {
        let selectedVenue = this.value;
        readCSVFile(function(data) {
            let countries = getDistinctValues(data.filter(row => row[5] === selectedVenue), 6); // Filter by venue
            populateDropdown('countryDropdown', countries);
        });
    });
});
