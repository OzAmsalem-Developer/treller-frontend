export const utilService = {
    getRandom,
    makeLorem,
    makeId,
    createWord,
    getRandomColor,
    getFormattedNowDate,
    scrollTo
}


let words = []
_populateWords()

//The maximum is exclusive and the minimum is inclusive
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function makeId(length = 5) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
// Returns a lorem with 'length' chars.
function makeLorem(length) {
    var randStr = '';
    while (randStr.length < length) {
        var word = words[getRandom(1, 28)];
        randStr += word + ' ';
    }
    randStr = randStr[0].toUpperCase() + randStr.substr(1)
    return randStr;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createWord(length) {
    var word = '';
    while (word.length < length) {
        var randChar = _getRandChar();
        word += randChar;
    }
    return word;
}

function getFormattedNowDate() {
    const date = new Date();
    const year = date.getFullYear().toString()
    let month = (date.getMonth() + 1).toString()
    let day = date.getDate().toString()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    return year + '-' + month + '-' + day
}

//Private

function _getRandChar() {
    var LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    var randIndex = parseInt(Math.random() * LETTERS.length)
    return LETTERS.charAt(randIndex);
}

function _populateWords() {
    words[1] = "escapology"
    words[2] = "brightwork"
    words[3] = "verkrampte"
    words[4] = "protectrix"
    words[5] = "nudibranch"
    words[6] = "grandchild"
    words[7] = "newfangled"
    words[8] = "flugelhorn"
    words[9] = "mythologer"
    words[10] = "pluperfect"
    words[11] = "jellygraph"
    words[12] = "quickthorn"
    words[13] = "rottweiler"
    words[14] = "technician"
    words[15] = "cowpuncher"
    words[16] = "middlebrow"
    words[17] = "jackhammer"
    words[18] = "triphthong"
    words[19] = "wunderkind"
    words[20] = "dazzlement"
    words[21] = "jabberwock"
    words[22] = "witchcraft"
    words[23] = "pawnbroker"
    words[24] = "thumbprint"
    words[25] = "motorcycle"
    words[26] = "cryptogram"
    words[27] = "torchlight"
    words[28] = "bankruptcy"
}

function scrollTo(element, scrollPixels, duration) {
    const scrollPos = element.scrollLeft;
    // Condition to check if scrolling is required
    if (
        !(
            (scrollPos === 0 || scrollPixels > 0) &&
            (element.clientWidth + scrollPos === element.scrollWidth ||
                scrollPixels < 0)
        )
    ) {
        // Get the start timestamp
        const startTime =
            "now" in window.performance
                ? performance.now()
                : new Date().getTime();

        function scroll(timestamp) {
            //Calculate the timeelapsed
            const timeElapsed = timestamp - startTime;
            //Calculate progress
            const progress = Math.min(timeElapsed / duration, 1);
            //Set the scrolleft
            element.scrollLeft = scrollPos + scrollPixels * progress;
            //Check if elapsed time is less then duration then call the requestAnimation, otherwise exit
            if (timeElapsed < duration) {
                //Request for animation
                window.requestAnimationFrame(scroll);
            } else {
                return;
            }
        }
        //Call requestAnimationFrame on scroll function first time
        window.requestAnimationFrame(scroll);
    }
}