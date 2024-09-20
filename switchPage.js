document.getElementById('redirect-link').addEventListener('click', function () {
    preloadHTML('index.html'); // Call the preload function with the file URL
});

function preloadHTML(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.innerHTML = html; // Store the HTML
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function showNewContent() {
    // Hide old content
    document.getElementById('content').style.display = 'none';
    // Show new content
    document.getElementById('newContentContainer').style.display = 'block';
}