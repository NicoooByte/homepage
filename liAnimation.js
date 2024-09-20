const list = document.querySelectorAll('li');
const unicodeChars = ['▒', '░', '▓', '█', '▐', '▌', '▀', '▄'];

let intervalId;

list.forEach((li) => {
    li.parentNode.addEventListener('mouseover', () => {
        intervalId = setInterval(() => {
            const text = li.textContent;
            const newText = text.split('').map((char) => {
                if (Math.random() < 0.1) {
                    return unicodeChars[Math.floor(Math.random() * unicodeChars.length)];
                }
                return char;
            }).join('');
            li.textContent = newText;
        }, 50); // Change the text every 50 milliseconds
    });

    li.parentNode.addEventListener('mouseout', () => {
        clearInterval(intervalId);
        const originalText = li.getAttribute('data-original-text');
        if (originalText) {
            li.textContent = originalText;
        }
    });

    // Store the original text of each list item
    li.setAttribute('data-original-text', li.textContent);
});