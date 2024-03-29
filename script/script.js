
// global variable to store search data
searchData = [];
var batsmanNameInput = document.getElementById('batsmanNameInput');
var batsmanNamesList = document.getElementById('batsmanNames');

// Function to populate dropdowns with distinct values
function populateDropdowns(data) {
    var opponentFilter = document.getElementById('opponentFilter');
    var countryFilter = document.getElementById('countryFilter');
    var venueFilter = document.getElementById('venueFilter');
    var dismissalModeFilter = document.getElementById('dismissalModeFilter');

    var opponents = [...new Set(data.map(item => item.opponent))];
    var countries = [...new Set(data.map(item => item.country))];
    var venues = [...new Set(data.map(item => item.venue))];
    var dismissalModes = [...new Set(data.map(item => item.dismissalMode))];
    //var batsmanNames = [...new Set(data.map(item => item.Batter))];

    opponents.forEach(opponent => {
         opponentFilter.innerHTML += `<option value="${opponent}">${opponent}</option>`;
    });

    countries.forEach(country => {
        countryFilter.innerHTML += `<option value="${country}">${country}</option>`;
    });

    venues.forEach(venue => {
        venueFilter.innerHTML += `<option value="${venue}">${venue}</option>`;
    });

    dismissalModes.forEach(mode => {
        dismissalModeFilter.innerHTML += `<option value="${mode}">${mode}</option>`;
    });
}

function populateBatsmanDropdown(data) {
    console.log('Populating data ....');
    var batsmanNameList = document.getElementById('batsmanNames');
    var batsmanNames = [...new Set(data.map(item => item.Batter))];
    console.log(batsmanNames.length);

    batsmanNames.forEach(item => {
        batsmanNameList.innerHTML += `<option value="${item}">${item}</option>`
    });
}

// Event listener for input change in batsman name input
batsmanNameInput.addEventListener('input', function () {
    var inputText = this.value;
    console.log('Input text ---- ' + inputText);
    handleBatsmenSearch(inputText);
});

// Function to filter data based on dropdown selections
function filterData(data) {
    var opponentFilterValue = document.getElementById('opponentFilter').value;
    var countryFilterValue = document.getElementById('countryFilter').value;
    var venueFilterValue = document.getElementById('venueFilter').value;
    var dismissalModeFilterValue = document.getElementById('dismissalModeFilter').value;

    var filteredData = data.filter(item => {
        return (opponentFilterValue === 'All' || item.opponent === opponentFilterValue) &&
            (countryFilterValue === 'All' || item.country === countryFilterValue) &&
            (venueFilterValue === 'All' || item.venue === venueFilterValue) &&
            (dismissalModeFilterValue === 'All' || item.dismissalMode === dismissalModeFilterValue);
    });

    return filteredData;
}

// Function to render search results
function renderResults(data) {
    var resultsContainer = document.getElementById('resultsContainer');
    var innerHTML = '';
    resultsContainer.innerHTML = ''; // Clear previous results

    innerHTML = innerHTML + '<table> <th>Test #</th><th> Wicket#</th> <th> Batsman </th> <th> Dismissal Mode</th> <th> Fielder</th>' +
        '<th> Opponent</th> <th> Country</th> <th> Venue</th> <th> Match Date</th> </tr>';

    data.forEach(item => {
        innerHTML += `<tr>
                                          <td>${item.TestMatchNumber}</td>
                                          <td> ${item.Wicket}</td>
                                          <td> ${item.Batter}</td>
                                          <td> ${item.dismissalMode}</td>
                                          <td> ${item.Fielder}</td>
                                          <td> ${item.opponent}</td>
                                          <td> ${item.country}</td>
                                          <td> ${item.venue}</td>
                                          <td> ${item.matchDate}</td>
                                        </tr>`;

    });

    innerHTML = innerHTML + '</table>';

    resultsContainer.innerHTML = innerHTML;
}

// Function to handle Wicket# search
function handleWicketSearch(input) {
    var wicketNumber = input.value.trim();
    console.log('wicket number ---  ' + wicketNumber);
    if (wicketNumber !== '') {
        // Perform search by Wicket#
        var filteredData = searchData.filter(item => item.Wicket === wicketNumber);
        console.log(filteredData);
        playVideos(filteredData);
        renderResults(filteredData);
        document.getElementById('wicketSearch').innerHTML='';
    } else {
        // Clear results if input is empty
        document.getElementById('resultsContainer').innerHTML = '';
    }
}

// Function to handle Batsman search
function handleBatsmenSearch(batsmanName) {
    
    console.log('Batsman Name ---  ' + batsmanName);
    if (batsmanName !== '') {
        // Perform search by Wicket#
        var filteredData = searchData.filter(item => item.Batter === batsmanName);
        playVideos(filteredData);
        renderResults(filteredData);
        document.getElementById('batsmanNameInput').innerHTML='';
    } else {
        // Clear results if input is empty
        document.getElementById('resultsContainer').innerHTML = '';
    }
}

// Function to handle enter key press for Wicket# search
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        document.getElementById('wicketSearch').blur(); // Remove focus from input field
        handleWicketSearch(document.getElementById('wicketSearch'));
        document.getElementById('wicketSearch').innerHTML = '';
        document.getElementById('batsmanNameInput').innerHTML = '';
    }
}

// Function to play videos in succession
function playVideos(filteredData) {
    var videoContainer = document.getElementById('videoContainer');
    var detailsContainer = document.getElementById('detailsContainer');
    var currentVideoIndex = 0;
    var videos = [];

    // Populate the videos array with the URLs of videos from filtered data
    filteredData.forEach(item => {

        var ashwintext = item.dismissalMode === 'bowled' ? 'Ashwin' : ' b Ashwin';

        videos.push({
            url: '../videos/' +item.video + '.mp4', details: `${item.Wicket}. ` +
                `${item.Batter}` +
                `  ${item.dismissalMode} ` +
                `  ${item.Fielder} ` + ashwintext +
                `  at ${item.venue}` + ' on ' + `${item.matchDate}`, description : `${item.description}`
        }); 

         /*videos.push({
            url: '../videos/' +item.video + '.mp4', details:  '' +item.description  
        }); */ 
    });

    function playNextVideo() {
        if (currentVideoIndex < videos.length) {
            var video = document.createElement('video');
            video.src = videos[currentVideoIndex].url;
            video.controls = true;
            video.autoplay = true;
            video.loop = false; // Set to true if you want videos to loop
            video.controlsList = "nodownload"; // Disable download option
            videoContainer.innerHTML = ''; // Clear previous video
            videoContainer.appendChild(video);

            // Update details below the video container
            detailsContainer.textContent = videos[currentVideoIndex].details;
            descriptionContainer.textContent = videos[currentVideoIndex].description;

            video.addEventListener('ended', function () {
                currentVideoIndex++;
                playNextVideo(); // Play the next video
            });
        }
    }

    // Start playing the videos
    playNextVideo();
}

//playVideos();

// Function to load data from CSV file
function loadData() {
    Papa.parse('../data/data.csv', {
        download: true,
        header: true,
        complete: function (results) {
            searchData = results.data;
            // Pass data to other functions
            populateDropdowns(results.data);
            populateBatsmanDropdown(results.data);
            //renderResults(results.data);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Call the loadData function to fetch and process the data
loadData();

// Function to update dropdown options based on selected value
function updateDropdownOptions(selectedOpponent, selectedCountry, selectedVenue, selectedDismissalMode) {
    var filteredData = searchData;

    // Filter data based on selected values
    if (selectedOpponent !== 'All') {
        filteredData = filteredData.filter(item => item.opponent === selectedOpponent);
    }
    if (selectedCountry !== 'All') {
        filteredData = filteredData.filter(item => item.country === selectedCountry);
    }
    if (selectedVenue !== 'All') {
        filteredData = filteredData.filter(item => item.venue === selectedVenue);
    }
    if (selectedDismissalMode !== 'All') {
        filteredData = filteredData.filter(item => item.dismissalMode === selectedDismissalMode);
    }

    // Update dropdown options
    populateOpponentDropdown(filteredData,selectedOpponent);
    populateCountryDropdown(filteredData, selectedCountry);
    populateVenueDropdown(filteredData, selectedVenue);
    populateDismissalModeDropdown(filteredData, selectedDismissalMode);
}

// Function to populate opponent dropdown options
function populateOpponentDropdown(data, selectedOpponent) {
    var opponentDropdown = document.getElementById('opponentFilter');
    opponentDropdown.innerHTML = '<option value="All">All Opponents</option>';
    var opponents = [...new Set(data.map(item => item.opponent))];
    opponents.forEach(opponent => {
        var isSelected = (opponent === selectedOpponent) ? 'selected' : '';
        opponentDropdown.innerHTML += `<option value="${opponent}" ${isSelected}>${opponent}</option>`;
    });
    document.getElementById('wicketSearch').textContent = '';
    playVideos(data);
    renderResults(data);
}

// Function to populate country dropdown options
function populateCountryDropdown(data, selectedCountry) {
    var countryDropdown = document.getElementById('countryFilter');
    countryDropdown.innerHTML = '<option value="All">All Countries</option>';
    var countries = [...new Set(data.map(item => item.country))];
    countries.forEach(country => {
        var isSelected = (country === selectedCountry) ? 'selected' : '';
        countryDropdown.innerHTML += `<option value="${country}" ${isSelected}>${country}</option>`;
    });
    document.getElementById('wicketSearch').textContent = '';
    playVideos(data);
    renderResults(data);
}

// Function to populate venue dropdown options
function populateVenueDropdown(data, selectedVenue) {
    var venueDropdown = document.getElementById('venueFilter');
    venueDropdown.innerHTML = '<option value="All">All Venues</option>';
    var venues = [...new Set(data.map(item => item.venue))];
    venues.forEach(venue => {
        var isSelected = (venue === selectedVenue) ? 'selected' : '';
        venueDropdown.innerHTML += `<option value="${venue}" ${isSelected}>${venue}</option>`;
    });
    document.getElementById('wicketSearch').innerHTML = '-';
    playVideos(data);
    renderResults(data);
}

// Function to populate dismissal mode dropdown options
function populateDismissalModeDropdown(data, selectedDismissalMode) {
    var dismissalModeDropdown = document.getElementById('dismissalModeFilter');
    dismissalModeDropdown.innerHTML = '<option value="All">All Dismissal Modes</option>';
    var dismissalModes = [...new Set(data.map(item => item.dismissalMode))];
    dismissalModes.forEach(dismissalMode => {
        var isSelected = (dismissalMode === selectedDismissalMode) ? 'selected' : '';
        dismissalModeDropdown.innerHTML += `<option value="${dismissalMode}" ${isSelected}>${dismissalMode}</option>`;
    });
    document.getElementById('wicketSearch').textContent = '';
    playVideos(data);
    renderResults(data);
}

// Function to handle change in opponent dropdown
function handleOpponentChange(selectedOpponent) {
    updateDropdownOptions(selectedOpponent, document.getElementById('countryFilter').value, document.getElementById('venueFilter').value, document.getElementById('dismissalModeFilter').value);
}

// Function to handle change in country dropdown
function handleCountryChange(selectedCountry) {
    updateDropdownOptions(document.getElementById('opponentFilter').value, selectedCountry, document.getElementById('venueFilter').value, document.getElementById('dismissalModeFilter').value);
}

// Function to handle change in venue dropdown
function handleVenueChange(selectedVenue) {
    updateDropdownOptions(document.getElementById('opponentFilter').value, document.getElementById('countryFilter').value, selectedVenue, document.getElementById('dismissalModeFilter').value);
}

// Function to handle change in dismissal mode dropdown
function handleDismissalModeChange(selectedDismissalMode) {
    updateDropdownOptions(document.getElementById('opponentFilter').value, document.getElementById('countryFilter').value, document.getElementById('venueFilter').value, selectedDismissalMode);
}

// Function to reset all dropdowns to their initial state
function resetDropdowns() {
    var selectedOpponent = 'All';
    var selectedCountry = 'All';
    var selectedVenue = 'All';
    var selectedDismissalMode = 'All';

    populateOpponentDropdown(searchData, selectedOpponent);
    populateCountryDropdown(searchData, selectedCountry);
    populateVenueDropdown(searchData, selectedVenue);
    populateDismissalModeDropdown(searchData, selectedDismissalMode);

    // Reset search criteria
    document.getElementById('opponentFilter').value = selectedOpponent;
    document.getElementById('countryFilter').value = selectedCountry;
    document.getElementById('venueFilter').value = selectedVenue;
    document.getElementById('dismissalModeFilter').value = selectedDismissalMode;
    document.getElementById('batsmanNameInput').value = '';
    document.getElementById('wicketSearch').value = '';

    videoContainer.innerHTML = ''; // Clear previous video
    detailsContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = ''; 

    // Call updateDropdownOptions to update other dropdowns based on reset values
    //updateDropdownOptions(selectedOpponent, selectedCountry, selectedVenue, selectedDismissalMode);
}