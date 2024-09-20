function adjustContrast(pixelValue, contrastFactor) {
    let normalizedPixel = pixelValue / 255;
    let adjustedPixel = ((normalizedPixel - 0.5) * contrastFactor) + 0.5;
    let finalPixel = Math.round(adjustedPixel * 255);
    return finalPixel;
}

function imageToUnicode(image, width, height, brightness = 50) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;
    //const chars = '@%#*+=-:. ';
    const chars = ' .:-=+*#%@';
    const unicodeString = [];

    for (let i = 0; i < height; i++) {
        let line = '';
        for (let j = 0; j < width; j++) {
            const pixelIndex = (i * width * 4) + (j * 4);
            const pixelValue = (imageData[pixelIndex] + imageData[pixelIndex + 1] + imageData[pixelIndex + 2]) / 3;
            const adjustedPixelValue = adjustContrast(pixelValue, 1.6);
            let charIndex = Math.floor(((adjustedPixelValue + brightness) / (255 + brightness)) * (chars.length - 1));
            clampedCharIndex = Math.max(1, Math.min(charIndex, chars.length - 1));
            line += chars[charIndex];
        }
        if (line.trim() == '')
            line = "&nbsp;"
        unicodeString.push(line + "<br/>");
    }

    return unicodeString.join('\n');
}


let output = document.getElementById("output");
output.style.display = "revert"
output.style.height = "fit-content"
output.innerHTML = ":";
let img_height = Math.floor((window.innerHeight + 100) / output.clientHeight) + 1;
output.style.height = ""
let img_width = Math.floor(img_height * 1.7);
output.innerHTML = ":".repeat(img_width)
var widthUncidodeLine = (output.clientWidth + 1)
document.getElementById('right').style.width = (window.innerWidth - widthUncidodeLine).toString() + "px"
document.getElementById('left').style.width = widthUncidodeLine.toString() + "px"

var currentPage = window.location.pathname.split('/').pop();
var imgMe = document.getElementById("me");

let bri = 0
if (currentPage == "index.html" || currentPage == "") {
    document.getElementById('right').classList.add("fade-in");
    animateMe(bri);
    const startUp = setInterval(() => {
        bri += 5;
        if (bri % 200 == 0) {
            clearInterval(startUp);
            return clearInterval;
        }
        animateMe(bri);
    }, 50);
}
else {
    output.style.display = "none"
    document.getElementById('redirect-link').addEventListener('click', function (event) {
        event.preventDefault();
        animateRedirect(function () {
            document.getElementById("main").style.display = "revert";
            document.getElementById("left").style.display = "none";
            window.location.href = 'index.html';
        });
        document.getElementById("output").style.display = "revert";
    });
    animateMe(bri)
    function animateRedirect(callback) {
        document.getElementById('right').classList.add("fade-out");
        document.getElementById('left').classList.add("fade-out");
        bri = 80;
        animateMe(bri)
        const startUp = setInterval(() => {
            bri -= 5;
            bri = bri % 200;
            if (bri % 200 == 0) {
                callback();
            }
            animateMe(bri)
        }, 50);
    }
}
function animateMe(bri) {
    if (imgMe == null)
        imgMe = document.getElementById("me")
    output.style.width = (widthUncidodeLine).toString() + "px";
    const unicodeString = imageToUnicode(imgMe, img_width, img_height, bri);
    output.innerHTML = unicodeString;
}