// javascript for the home page

const leftGrid = document.getElementById('leftGrid');
const rightGrid = document.getElementById('rightGrid');
const leftGridOdi = document.getElementById('leftGridOdi');
const rightGridOdi = document.getElementById('rightGridOdi');
const errorContainer = document.getElementById('errorContainer');

leftGrid.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        rightGrid.appendChild(target.parentElement.cloneNode(true));
        target.style.opacity = '0.5';
        target.remove();
    }
});

rightGrid.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        leftGrid.appendChild(target.parentElement.cloneNode(true));
        target.remove();
    }
});

leftGridOdi.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        rightGridOdi.appendChild(target.parentElement.cloneNode(true));
        target.style.opacity = '0.5';
        target.remove();
    }
});

rightGridOdi.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        leftGridOdi.appendChild(target.parentElement.cloneNode(true));
        target.remove();
    }
});

function displayError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function submitSelection() {
    const activeTab = document.querySelector('.tab-content.active');
    const selectedImages = activeTab.querySelectorAll('.right-grid img');
    const selectedCount = selectedImages.length;

    if (selectedCount === 0) {
        displayError('Please select at least one image.');
        return;
    }

    const selectedNames = Array.from(selectedImages).map(img => img.getAttribute('data-name'));
    const queryParams = new URLSearchParams();
    queryParams.append('players', selectedNames.join(','));
    window.location.href = './html/multi-combo.html' + '?' + queryParams.toString();
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.trim() === tabId.charAt(0).toUpperCase() + tabId.slice(1)) {
            tab.classList.add('active');
        }
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
}