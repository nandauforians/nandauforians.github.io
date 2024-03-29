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
function populateDropdown(values, elementName) {
    let dropdown = document.getElementById(elementName);
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
        let distinctValues = getDistinctValues(data, 8); // Assuming venue column is at index 2
        populateDropdown(distinctValues, 'venueDropdown');
    });
});

// Call readCSVFile function when the document loads
document.addEventListener('DOMContentLoaded', function() {
    readCSVFile(function(data) {
        let distinctValues = getDistinctValues(data, 7); // Assuming venue column is at index 2
        populateDropdown(distinctValues, 'opponentDropdown');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    readCSVFile(function(data) {
        let distinctValues = getDistinctValues(data, 9); // Assuming venue column is at index 2
        populateDropdown(distinctValues, 'hostCountryDropdown');
    });
});


