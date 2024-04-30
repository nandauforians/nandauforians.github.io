// global variable to store search data
searchData = [];
videoData = [];
const delayBeforePlay = 500;
var playerName;
var videoUrls = new Map([
    ["Ashwin", "https://nandauforians.github.io/raviashwin"],
    ["Bumrah", "https://nandauforians.github.io/jaspritbumrah"],
    ["Shami", "https://nandauforians.github.io/mdshami"],
    ["Jadeja", "https://nandauforians.github.io/ravijadeja"]
]);

var bowler1;
var bowler2;

var batsmanNameInput = document.getElementById('batsmanNameInput');
var batsmanNamesList = document.getElementById('batsmanNames');

var fielderNameInput = document.getElementById('fielderNameInput');
var fielderNamesList = document.getElementById('fielderNames');

// Get reference to select element
const testMatchIdSelect = document.getElementById('test-match-id');

// Function to scroll to the video container
function scrollToVideoContainer() {
    const videoContainer = document.getElementById('videoContainer');
    // const videoContainer1 = document.getElementById('videoContainer1');
    // const videoContainer2 = document.getElementById('videoContainer2');
    //alert(videoContainer);
    if (videoContainer) {
        console.log('Scrolling into view ....');
        videoContainer.scrollIntoView({ behavior: 'smooth' });
    }
}


// Function to populate dropdowns with distinct values
function populateDropdowns(data) {
    var opponentFilter = document.getElementById('opponentFilter');
    var countryFilter = document.getElementById('countryFilter');
    var venueFilter = document.getElementById('venueFilter');
    var dismissalModeFilter = document.getElementById('dismissalModeFilter');
    var fieldingPositionFilter = document.getElementById('fieldingPositionFilter');

    var opponents = [...new Set(data.map(item => item.opponent))];
    var countries = [...new Set(data.map(item => item.country))];
    var venues = [...new Set(data.map(item => item.venue))];
    var dismissalModes = [...new Set(data.map(item => item.dismissalMode))];
    var fieldingPositions = [...new Set(data.map(item => item.fieldingPosition))];

    //var batsmanNames = [...new Set(data.map(item => item.Batter))];

    opponents = opponents.filter(item => item != undefined);
    countries = countries.filter(item => item != undefined);
    venues = venues.filter(item => item != undefined);
    dismissalModes = dismissalModes.filter(item => item != undefined);
    fieldingPositions = fieldingPositions.filter(item => item != undefined);

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

    fieldingPositions.forEach(mode => {
        fieldingPositionFilter.innerHTML += `<option value="${fieldingPosition}">${fieldingPosition}</option>`;
    });

}

// code to listen batsman name selections and call the search to display the batsman filter videos
let batsmanInputTimeout;

batsmanNameInput.addEventListener('input', function () {
    var inputText = this.value;
    // Clear any existing timeout

    clearTimeout(batsmanInputTimeout);
    batsmanNameInput.addEventListener('input', function () {
        // Clear any existing timeout
        clearTimeout(batsmanInputTimeout);

        // Set a timeout to wait for user to finish typing
       batsmanInputTimeout = setTimeout(() => {
            // Get the current value of the input field
            const inputText = this.value.trim();

            // If the value matches an option in the datalist, call the search function
            const optionSelected = Array.from(batsmanNames.options).some(option => option.value === inputText);
            if (optionSelected) {
                console.log('Input text ---- ' + inputText);
                handleBatsmenSearch(inputText);
            }
        }, 500); // Adjust this timeout value as needed (milliseconds)
    });

    // Listen for change event on the input field to trigger when a value is selected from the dropdown
    batsmanNameInput.addEventListener('change', function () {
        var inputText = this.value.trim();
        // If the value matches an option in the datalist, call the search function
        const optionSelected = Array.from(batsmanNames.options).some(option => option.value === inputText);
        if (optionSelected) {
            console.log('Input text ---- ' + inputText);
            handleBatsmenSearch(inputText);
        }
    });

    // Listen for blur event to clear the timeout when the input field loses focus
    batsmanNameInput.addEventListener('blur', function () {
        clearTimeout(fielderInputTimeout);
    });
});



// dropdown to populate the batsmen names as the user enters few letters of the name
function populateBatsmanDropdown(data) {
    console.log('Populating data ....');
    var batsmanNameList = document.getElementById('batsmanNames');
    var batsmanNames = [...new Set(data.map(item => item.Batter))];
    console.log(batsmanNames.length);

    batsmanNames.forEach(item => {
        batsmanNameList.innerHTML += `<option value="${item}">${item}</option>`
    });
}


let fielderInputTimeout;

// Event listener for input change in fielder name input- code changed to ensure search is called only when
// actual value is selected.
fielderNameInput.addEventListener('input', function () {
    var inputText = this.value;
    // Clear any existing timeout

    clearTimeout(fielderInputTimeout);
    fielderNameInput.addEventListener('input', function () {
        // Clear any existing timeout
        clearTimeout(fielderInputTimeout);

        // Set a timeout to wait for user to finish typing
        fielderInputTimeout = setTimeout(() => {
            // Get the current value of the input field
            const inputText = this.value.trim();

            // If the value matches an option in the datalist, call the search function
            const optionSelected = Array.from(fielderNames.options).some(option => option.value === inputText);
            if (optionSelected) {
                console.log('Input text ---- ' + inputText);
                handleFielderNameSearch(inputText);
            }
        }, 500); // Adjust this timeout value as needed (milliseconds)
    });

     // Listen for change event on the input field to trigger when a value is selected from the dropdown
     fielderNameInput.addEventListener('change', function () {
        var inputText = this.value.trim();
        // If the value matches an option in the datalist, call the search function
        const optionSelected = Array.from(fielderNames.options).some(option => option.value === inputText);
        if (optionSelected) {
            console.log('Input text ---- ' + inputText);
            handleFielderNameSearch(inputText);
        }
    });

    // Listen for blur event to clear the timeout when the input field loses focus
    fielderNameInput.addEventListener('blur', function () {
        clearTimeout(fielderInputTimeout);
    });
});



// dropdown to populate the batsmen names as the user enters few letters of the name
function populateFielderDropdown(data) {
    console.log('Populating Fielder data ....');
    var fielderNameList = document.getElementById('fielderNames');
    var fielderNames = [...new Set(data.map(item => item.Fielder))];
    console.log(fielderNames.length);

    fielderNames.forEach(item => {
        fielderNameList.innerHTML += `<option value="${item}">${item}</option>`
    });
}

// Function to return the list of wickets by fielder names
function handleFielderNameSearch(fielderName) {

    console.log('Fielder Name ---  ' + fielderName);
    if (fielderName !== '') {
        // Perform search by Wicket#
        var filteredData = searchData.filter(item => item.Fielder === fielderName);
        setTimeout(function () {
            playVideos(filteredData, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
        renderResults(filteredData);
        document.getElementById('fielderNameInput').innerHTML = '';
    } else {
        // Clear results if input is empty
        // document.getElementById('resultsContainer').innerHTML = '';
    }
}

// Function to filter data based on dropdown selections
function filterData(data) {
    var opponentFilterValue = document.getElementById('opponentFilter').value;
    var countryFilterValue = document.getElementById('countryFilter').value;
    var venueFilterValue = document.getElementById('venueFilter').value;
    var dismissalModeFilterValue = document.getElementById('dismissalModeFilter').value;
    var fieldingPositionFilterValue = document.getElementById('fieldingPositionFilter').value;

    console.log("Fielding Position Filter value ---- " + fieldingPositionFilterValue);

    var filteredData = data.filter(item => {
        return (opponentFilterValue === 'All' || item.opponent === opponentFilterValue) &&
            (countryFilterValue === 'All' || item.country === countryFilterValue) &&
            (venueFilterValue === 'All' || item.venue === venueFilterValue) &&
            (dismissalModeFilterValue === 'All' || item.dismissalMode === dismissalModeFilterValue) &&
            (fieldingPositionFilterValue === 'All') || item.fieldingPosition === fieldingPositionFilterValue;
    });

    return filteredData;
}

// Function to handle Wicket# search
function handleWicketSearch(input) {
    var wicketNumber = input.value.trim();
    console.log('wicket number ---  ' + wicketNumber);
    if (wicketNumber !== '') {
        // Perform search by Wicket#
        var filteredData = searchData.filter(item => item.Wicket === wicketNumber);
        console.log(filteredData);

        setTimeout(function () {
            playVideos(filteredData, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);

        //playVideos(filteredData);
        renderResults(filteredData);
        //document.getElementById('wicketSearch').innerHTML = '';
    } else {
        // Clear results if input is empty
        document.getElementById('resultsContainer').innerHTML = '';
    }
}

// Function to handle Wicket# search
function handleTestMatchSearch(input) {
    var TestMatchNumber = input.value;
    console.log('test match number ---  ' + TestMatchNumber);
    if (TestMatchNumber !== '') {
        // Perform search by Wicket#
        var filteredData = searchData.filter(item => item.TestMatchNumber === TestMatchNumber);
        //console.log(filteredData);
        setTimeout(function () {
            playVideos(filteredData, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
        renderResults(filteredData);

        if (filteredData.length == 0) {
            alert('No wickets in the given test match');
        }

        document.getElementById('testSearch').innerHTML = '';
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
        setTimeout(function () {
            playVideos(filteredData, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
        renderResults(filteredData);
        document.getElementById('batsmanNameInput').innerHTML = '';
    } else {
        // Clear results if input is empty
        // document.getElementById('resultsContainer').innerHTML = '';
    }
}

// Function to handle enter key press for Wicket# search
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        //document.getElementById('wicketSearch').blur(); // Remove focus from input field
        handleWicketSearch(document.getElementById('wicketSearch'));
        //document.getElementById('wicketSearch').innerHTML = '';
        document.getElementById('batsmanNameInput').innerHTML = '';
    }
}

// Function to filter only the milestone wickets
function filterMilestoneWickets() {
    console.log("Displaying only the milestone wickets");
    var filteredData = searchData.filter(item => item.Milestone == 'Yes');
    console.log("Displaying only the milestone wickets" + searchData.length + ": " + filteredData.length);

    setTimeout(function () {
        playVideos(filteredData, 0); // Play the videos after delay
        scrollToVideoContainer(); // Scroll to the video container
    }, delayBeforePlay);
}

// Function to filter only the away wickets
function playAllAwayWickets() {
    console.log("Displaying only the away wickets");
    var filteredData = searchData.filter(item => item.country != 'India');

    setTimeout(function () {
        playVideos(filteredData, 0); // Play the videos after delay
        scrollToVideoContainer(); // Scroll to the video container
    }, delayBeforePlay);
}

// Function to filter only the milestone wickets
function filterBumrahSpecialWickets() {
    console.log("Displaying only the special wickets");
    var filteredData = searchData.filter(item => item.Special == 'Yes');

    setTimeout(function () {
        playVideos(filteredData, 0); // Play the videos after delay
        scrollToVideoContainer(); // Scroll to the video container
    }, delayBeforePlay);
}


// Function to play videos in succession
function playVideos(filteredData, videoIndex) {
    var videoContainer = document.getElementById('videoContainer');
    //var videoContainer1 = document.getElementById('videoContainer1');
    //var videoContainer2 = document.getElementById('videoContainer2');
    var detailsContainer = document.getElementById('detailsContainer');
    var currentVideoIndex = 0;
    var videos = [];
    var videoLength = filteredData.length;
    var videoCount = 1;

    videoData = filteredData;

    //currentVideoIndex = videoIndex ? videoIndex = 0 : videoIndex > 0;
    //console.log("PlayVideos: VideoIndex : " + videoIndex);

    if (videoIndex > 1) {
        currentVideoIndex = videoIndex;
        //console.log("new current video index --- " + currentVideoIndex);
    }

    // Populate the videos array with the URLs of videos from filtered data
    filteredData.forEach(item => {
        playerName = item.player;
        var url = videoUrls.get(playerName);

        console.log("Wkt: " + item.Wicket + " MatchID: " + item.match +
            " Bowler: " + playerName + "Inning : " + item.innings);

        var playerNameText = item.dismissalMode === 'bowled' ? playerName : ' b ' + playerName;

        videos.push({
            url: url + "/videos/" + item.video + '.mp4',
            details: playerName + "-" + `${item.Wicket}: ` +
                `${item.Batter}` +
                `  ${item.dismissalMode} ` +
                `  ${item.Fielder} ` + playerNameText +
                `  at ${item.venue}` + ' on ' + `${item.matchDate} ` + '('
                + videoCount + "/ " + videoLength + ') ',
            description: `${item.description}`,
            videoCounter: videoCount,
            player: item.player
        });

        // Start playing the videos
        playNextVideo(videos, currentVideoIndex);

        videoCount++;
    });

}

function replayVideos() {
    console.log("Entering replay videos ....");
    var size = videoData.length;
    console.log("Video Data Size before replay ---" + size);

    playVideos(videoData, 0);
}

function playNextVideo(videos, currentVideoIndex) {
    if (currentVideoIndex < videos.length) {
        var video = document.createElement('video');

        var videoContainer = document.getElementById('videoContainer');

        //var videoContainer1 = document.getElementById('videoContainer1');
        //var videoContainer2 = document.getElementById('videoContainer2');

        video.src = videos[currentVideoIndex].url;
        var currentPlayer = videos[currentVideoIndex].player;

        console.log("Video URL ----" + video.src + " :  bowler : " + currentPlayer);
        video.controls = true;
        video.autoplay = true;
        video.loop = false; // Set to true if you want videos to loop
        video.controlsList = "nodownload"; // Disable download option

        //code to play videos in 2 container side by side

        videoContainer.innerHTML = ''; // Clear previous video
        videoContainer.appendChild(video);

        // Listen for full-screen change event
        video.addEventListener('fullscreenchange', function () {
            if (!document.fullscreenElement) {
                // Exiting full-screen mode
                // Continue playing next video in full-screen mode
                playNextVideo(videos, currentVideoIndex + 1);
            }
        });

        document.getElementById('replayButtonContainer').style.display = "block";

        if (currentVideoIndex > 0) {
            console.log("Displaying the previous button ....");
            document.getElementById('previousButtonContainer').style.display = "block";
        }

        if (currentVideoIndex < (videos.length - 1)) {
            console.log("Display the next Button ....");
            document.getElementById('nextButtonContainer').style.display = "block";
        } else {
            document.getElementById('nextButtonContainer').style.display = "none";
        }

        // Update details below the video container
        detailsContainer.textContent = videos[currentVideoIndex].details;
        descriptionContainer.textContent = videos[currentVideoIndex].description;
        document.getElementById('videoCounter').value = videos[currentVideoIndex].videoCounter;
        //console.log("Video currently playing ---- " + document.getElementById('videoCounter').value); 
        //console.log("current video index ----" + currentVideoIndex);

        video.addEventListener('ended', function () {
            currentVideoIndex++;
            playNextVideo(videos, currentVideoIndex); // Play the next video
        });
    }
}


function playbackPreviousVideo(currentVideo) {

    console.log(' Inside play previous video .... -' + currentVideo);
    playVideos(videoData, currentVideo - 2);
    //playNextVideo(videoData); 
}

function playbackNextVideo(currentVideo) {
    console.log("Inside play next video  ----- " + currentVideo);
    playVideos(videoData, currentVideo);
}

function playAllVideos() {
    console.log("Play all videos ---" + searchData.length);
    playVideos(searchData, 0);
};

// Function to load data from CSV file
function loadData(player) {
    var playerName = player;
    console.log("Loading data ......" + player);

    return new Promise((resolve, reject) => {
        Papa.parse('../data/' + player + '.csv', {
            download: true,
            header: true,
            complete: function (results) {
                var searchData = results.data;
                searchData = searchData.filter(item => item.Wicket !== undefined);
                console.log("Search data size ---" + searchData.length);

                // Call resolve with the searchData
                resolve(searchData);
            },
            error: function (error) {
                console.error('Error fetching data:', error);
                // Call reject with the error
                reject(error);
            }
        });
    });
}


// Function to load data from CSV file for the specified bowler
function loadBowlerData(bowlerName) {
    return new Promise((resolve, reject) => {
        Papa.parse(`../data/${bowlerName}.csv`, {
            download: true,
            header: true,
            complete: function (results) {
                resolve(results.data.filter(item => item.Wicket != null));
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

// Function to load data for both bowlers, join the data, and sort by match column
async function initializePage(bowlerNames) {
    try {

        // Initialize an array to store promises for loading data
        const loadDataPromises = [];
        var combinedData = [];

        // Example of how to use the loadData function
        await Promise.all(bowlerNames.map(async bowlerName => {
            console.log("Bowler in progress: " + bowlerName);

            // Load data for the current bowler
            const bowlerData = await loadData(bowlerName);

            // Check if bowlerData is available
            if (bowlerData) {
                console.log("Bowler: " + bowlerName + ", data: " + bowlerData.length);
                combinedData = combinedData.concat(bowlerData); // Corrected line
                console.log("Combined data length: " + combinedData.length);
            } else {
                // Handle the case where bowlerData is null or an error occurred
                console.error("Failed to load bowler data.");
            }
        }));

        // Use Promise.all to load data asynchronously for all bowlers
        const bowlerDataArray = await Promise.all(loadDataPromises);

        // Combine all data for all bowlers into a single array
        searchData = combinedData;
        console.log('Combined data  : ' + searchData.length);

        // Sort the combined data by 'match' and 'innings'
        searchData.sort((a, b) => {
            // First, sort by 'match'
            if (a.match < b.match) return -1;
            if (a.match > b.match) return 1;

            // If 'match' is the same, sort by 'innings'
            if (a.innings < b.innings) return -1;
            if (a.innings > b.innings) return 1;

            // sort by overs
            let overA = parseFloat(a.overs);
            let overB = parseFloat(b.overs);

            return overA - overB;

            // If both 'match' and 'innings' are the same, maintain the current order
            return 0;
        });

        populateMatchIds(searchData, bowlerNames);
        populateDropdowns(searchData);
        populateBatsmanDropdown(searchData);
        populateFielderDropdown(searchData);
        //renderResults(searchData);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}


// Function to update dropdown options based on selected value
function updateDropdownOptions(selectedOpponent, selectedCountry, selectedVenue, selectedDismissalMode, selectedFieldingPosition) {
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

    if (selectedFieldingPosition !== 'All') {
        filteredData = filteredData.filter(item => item.fieldingPosition === selectedFieldingPosition);
    }

    var resetFlag = false;

    // Update dropdown options
    populateOpponentDropdown(filteredData, selectedOpponent, resetFlag);
    populateCountryDropdown(filteredData, selectedCountry, resetFlag);
    populateVenueDropdown(filteredData, selectedVenue, resetFlag);
    populateDismissalModeDropdown(filteredData, selectedDismissalMode, resetFlag);
    populateFieldingPositionDropdown(filteredData, selectedFieldingPosition, resetFlag);
}

// Function to populate opponent dropdown options
function populateOpponentDropdown(data, selectedOpponent, resetFlag) {
    var opponentDropdown = document.getElementById('opponentFilter');
    opponentDropdown.innerHTML = '<option value="All">All Opponents</option>';
    var opponents = [...new Set(data.map(item => item.opponent))];
    opponents = opponents.filter(item => item != undefined);
    opponents.forEach(opponent => {
        var isSelected = (opponent === selectedOpponent) ? 'selected' : '';
        opponentDropdown.innerHTML += `<option value="${opponent}" ${isSelected}>${opponent}</option>`;
    });
    //document.getElementById('wicketSearch').textContent = '';
    console.log("reset Flag --- " + resetFlag);

    if (resetFlag == false) {
        console.log('Playing videos after delay ....')
        setTimeout(function () {
            playVideos(data, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
    }
    renderResults(data);
}

// Function to populate country dropdown options
function populateCountryDropdown(data, selectedCountry, resetFlag) {
    var countryDropdown = document.getElementById('countryFilter');
    countryDropdown.innerHTML = '<option value="All">All Countries</option>';
    var countries = [...new Set(data.map(item => item.country))];
    countries = countries.filter(item => item != undefined);
    countries.forEach(country => {
        var isSelected = (country === selectedCountry) ? 'selected' : '';
        countryDropdown.innerHTML += `<option value="${country}" ${isSelected}>${country}</option>`;
    });
    //document.getElementById('wicketSearch').textContent = '';
    if (resetFlag == false) {
        console.log("Populate country drop down ---- " + resetFlag);
        setTimeout(function () {
            playVideos(data, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
    }
    renderResults(data);
}

// Function to populate venue dropdown options
function populateVenueDropdown(data, selectedVenue, resetFlag) {
    var venueDropdown = document.getElementById('venueFilter');
    venueDropdown.innerHTML = '<option value="All">All Venues</option>';
    var venues = [...new Set(data.map(item => item.venue))];
    venues = venues.filter(item => item != undefined);
    venues.forEach(venue => {
        var isSelected = (venue === selectedVenue) ? 'selected' : '';
        venueDropdown.innerHTML += `<option value="${venue}" ${isSelected}>${venue}</option>`;
    });
    //document.getElementById('wicketSearch').innerHTML = '-';
    if (resetFlag == false) {
        setTimeout(function () {
            playVideos(data, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
    }
    renderResults(data);
}

// Function to populate dismissal mode dropdown options
function populateDismissalModeDropdown(data, selectedDismissalMode, resetFlag) {
    var dismissalModeDropdown = document.getElementById('dismissalModeFilter');
    dismissalModeDropdown.innerHTML = '<option value="All">All Dismissal Modes</option>';
    var dismissalModes = [...new Set(data.map(item => item.dismissalMode))];
    dismissalModes = dismissalModes.filter(item => item != undefined);
    dismissalModes.forEach(dismissalMode => {
        var isSelected = (dismissalMode === selectedDismissalMode) ? 'selected' : '';
        dismissalModeDropdown.innerHTML += `<option value="${dismissalMode}" ${isSelected}>${dismissalMode}</option>`;
    });
    //document.getElementById('wicketSearch').textContent = '';


    // Check if the selected value is "caught"
    if (dismissalModeDropdown.value == "caught") {
        // If yes, show the FieldingPositionDropdown
        fieldingPosition.style.display = "block";
        console.log(' Displaying the Fielding Position Dropdown');
    } else {
        // If not, hide the FieldingPositionDropdown
        fieldingPosition.style.display = "none";
    }

    if (resetFlag == false) {
        setTimeout(function () {
            playVideos(data, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
    }
    renderResults(data);
}

// Function to populate dismissal mode dropdown options
function populateFieldingPositionDropdown(data, selectedFieldingPosition, resetFlag) {
    var fieldingPositionDropdown = document.getElementById('fieldingPositionFilter');
    fieldingPositionDropdown.innerHTML = '<option value="All">All Dismissal Modes</option>';
    var fieldingPositions = [...new Set(data.map(item => item.fieldingPosition))];
    fieldingPositions = fieldingPositions.filter(item => item != undefined);

    fieldingPositions.forEach(fieldingPosition => {
        var isSelected = (fieldingPosition === selectedFieldingPosition) ? 'selected' : '';
        fieldingPositionDropdown.innerHTML += `<option value="${fieldingPosition}" ${isSelected}>${fieldingPosition}</option>`;
    });

    //document.getElementById('wicketSearch').textContent = '';
    if (resetFlag == false) {
        setTimeout(function () {
            playVideos(data, 0); // Play the videos after delay
            scrollToVideoContainer(); // Scroll to the video container
        }, delayBeforePlay);
    }
    renderResults(data);
}

// Function to handle change in opponent dropdown
function handleOpponentChange(selectedOpponent) {
    updateDropdownOptions(selectedOpponent,
        document.getElementById('countryFilter').value,
        document.getElementById('venueFilter').value,
        document.getElementById('dismissalModeFilter').value,
        document.getElementById('fieldingPositionFilter').value);
}

// Function to handle change in country dropdown
function handleCountryChange(selectedCountry) {
    updateDropdownOptions(document.getElementById('opponentFilter').value,
        selectedCountry,
        document.getElementById('venueFilter').value,
        document.getElementById('dismissalModeFilter').value,
        document.getElementById('fieldingPositionFilter').value);
}

// Function to handle change in venue dropdown
function handleVenueChange(selectedVenue) {
    updateDropdownOptions(document.getElementById('opponentFilter').value,
        document.getElementById('countryFilter').value,
        selectedVenue,
        document.getElementById('dismissalModeFilter').value,
        document.getElementById('fieldingPositionFilter').value
    );
}

// Function to handle change in dismissal mode dropdown
function handleDismissalModeChange(selectedDismissalMode) {
    updateDropdownOptions(document.getElementById('opponentFilter').value,
        document.getElementById('countryFilter').value,
        document.getElementById('venueFilter').value,
        selectedDismissalMode,
        document.getElementById('fieldingPositionFilter').value);
}

// Function to handle change in dismissal mode dropdown
function handleFieldingPositionChange(selectedFieldingPosition) {
    console.log('Selected Fielding Position ---> ' + selectedFieldingPosition);
    console.log('Selected Opponent --- ' + document.getElementById('opponentFilter').value);
    console.log('Selected Country --- ' + document.getElementById('countryFilter').value);
    console.log('Selected Venue --- ' + document.getElementById('venueFilter').value);
    console.log('Selected Dismissal Mode --- ' + document.getElementById('dismissalModeFilter').value);

    updateDropdownOptions(document.getElementById('opponentFilter').value,
        document.getElementById('countryFilter').value,
        document.getElementById('venueFilter').value,
        document.getElementById('dismissalModeFilter').value,
        selectedFieldingPosition);
}


// Function to reset all dropdowns to their initial state
function resetDropdowns() {



    var selectedOpponent = 'All';
    var selectedCountry = 'All';
    var selectedVenue = 'All';
    var selectedDismissalMode = 'All';
    var selectedFieldingPosition = 'All';
    var resetFlag = true;


    populateOpponentDropdown(searchData, selectedOpponent, resetFlag);
    populateCountryDropdown(searchData, selectedCountry, resetFlag);
    populateVenueDropdown(searchData, selectedVenue, resetFlag);
    populateDismissalModeDropdown(searchData, selectedDismissalMode), resetFlag;
    populateFieldingPositionDropdown(searchData, selectedFieldingPosition, resetFlag);

    // Reset search criteria
    document.getElementById('opponentFilter').value = selectedOpponent;
    document.getElementById('countryFilter').value = selectedCountry;
    document.getElementById('venueFilter').value = selectedVenue;
    document.getElementById('dismissalModeFilter').value = selectedDismissalMode;
    document.getElementById('fieldingPositionFilter').value = selectedFieldingPosition;
    document.getElementById('batsmanNameInput').value = '';
    //document.getElementById('wicketSearch').value = '';
    //document.getElementById('testSearch').value = '';
    document.getElementById('fielderNameInput').value = '';
    document.getElementById('previousButtonContainer').style.display = "none";
    document.getElementById('nextButtonContainer').style.display = "none";
    document.getElementById('replayButtonContainer').style.display = "none";
    document.getElementById('test-match-id').value = "default";

    videoContainer.innerHTML = ''; // Clear previous video
    //videoContainer2.innerHTML = '';
    detailsContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = '';

    // Call updateDropdownOptions to update other dropdowns based on reset values
    //updateDropdownOptions(selectedOpponent, selectedCountry, selectedVenue, selectedDismissalMode);
}


function renderResults(data) {
    var resultsContainer = document.getElementById('resultsContainer');
    var innerHTML = '';
    resultsContainer.innerHTML = ''; // Clear previous results

    innerHTML = `<table class="results-table">
                    <thead>
                        <tr>
                            <th>Test #</th>
                            <th>Innings</th>
                            <th>Over</th>
                            <th>Wicket #</th>
                            <th>Batsman</th>
                            <th>Dismissal Mode</th>
                            <th>Fielder</th>
                            <th>Bowler</th>
                            <th>Opponent</th>
                            <th>Country</th>
                            <th>Venue</th>
                            <th>Match Date</th>
                            <th>Match ID</th>
                        </tr>
                    </thead>
                    <tbody>`;

    data.forEach((item, index) => {
        innerHTML += `<tr class="${index % 2 === 0 ? 'even-row' : 'odd-row'}">
                        <td>${item.TestMatchNumber}</td>
                        <td>${item.innings}</td>
                        <td>${item.overs}</td>
                        <td>${item.Wicket}</td>
                        <td>${item.Batter}</td>
                        <td>${item.dismissalMode}</td>
                        <td>${item.Fielder}</td>
                        <td>${item.player}</td>
                        <td>${item.opponent}</td>
                        <td>${item.country}</td>
                        <td>${item.venue}</td>
                        <td>${item.matchDate}</td>
                        <td>${item.match}</td>
                    </tr>`;
    });

    innerHTML += `</tbody></table>`;

    resultsContainer.innerHTML = innerHTML;
}


// Function to handle button click and access the hidden variable value
function handleButtonClick() {
    // Get the hidden variable value by accessing its value attribute
    var hiddenValue = document.getElementById('hiddenVariable').value;

    // Pass the hidden variable value to another function or perform any action
    yourFunction(hiddenValue);
}


// Event listener for change in dropdown selection
testMatchIdSelect.addEventListener('change', function () {
    const selectedTestId = testMatchIdSelect.value;
    // Load videos for the selected Test Match ID
    filterByMatchId(selectedTestId);
});

function populateMatchIds(searchData, selectedBowlerNames) {
    // Array to store all player match data
    const allPlayerMatchData = [];
    const uniqueMatchIds = [...new Set(searchData.map(row => row['match']))];
    console.log("Match ID count :" + uniqueMatchIds.length);

    uniqueMatchIds.forEach(matchId => {
        const matchDetails = searchData.filter(row => row['match'] === matchId);

        // Check if the match features wickets from all selected bowlers
        const allBowlersPresent = selectedBowlerNames.every(bowlerName => {
            return matchDetails.some(row => row['player'] === bowlerName);
        });

        // Construct description for the match
        const description = `Match: ${matchId}, ${matchDetails[0]['opponent']} @ ${matchDetails[0]['venue']}, Date: ${matchDetails[0]['matchDate']}`;

        // Create option element for the match
        const option = document.createElement('option');
        option.textContent = description;
        option.value = matchId;

        // Set background color based on condition
        if ((selectedBowlerNames.length > 1) && allBowlersPresent) {
            option.style.backgroundColor = 'green'; // Set background color to green if all bowlers are present
        } else {
            option.style.backgroundColor = 'white'; // Set background color to red if not all bowlers are present
        }

        testMatchIdSelect.appendChild(option);
    });
}




// Function to filter only the milestone wickets
function filterByMatchId(selectedTestMatchId) {
    console.log("Displaying wickets from the selected test match :" + selectedTestMatchId);

    var filteredData = searchData.filter(item => item.match == selectedTestMatchId);
    console.log("TESTINGGGG ............Data length ---  " + filteredData.length);
    renderResults(filteredData);

    setTimeout(function () {
        playVideos(filteredData, 0); // Play the videos after delays
        scrollToVideoContainer(); // Scroll to the video container
    }, delayBeforePlay);
}

function updatePlaceholder() {
    var dropdown = document.getElementById("test-match-id");
    var selectedValue = dropdown.value;
    var placeholderText = "Pick your match";

    if (selectedValue !== "default") {
        placeholderText = ""; // Clear placeholder text if a value other than default is selected
    }

    dropdown.setAttribute("data-placeholder", placeholderText);
}

// Call updatePlaceholder initially to set initial placeholder
updatePlaceholder();