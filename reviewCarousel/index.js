document.addEventListener('DOMContentLoaded', function() {

    /*
    Todo:
    - implement a queue stack for iterating over users
    */

    const MAIN = document.querySelector('main');
    const PUNCTUATION = ['.', '!', '?'];
    let images = [];


    function getRandom(min, max) {
        return Math.round(Math.random()*min)+max;
    }
    function getImage() {
        return new Promise(async (resolve, reject) => {
            const random_first = Math.floor(Math.random() * 500) + 200;
            const random_second = Math.floor(Math.random() * 500) + 200;
            let response = await fetch('https://source.unsplash.com/random/'+random_first+'x'+random_second);
            resolve(response['url']);
        })
    }
    function getParagraph() {
        let sentence = "";
        const TOTAL_SENTENCES = getRandom(5, 2);
        for (let i = 0; i < TOTAL_SENTENCES; i++) {
            let sentence_length = getRandom(5, 5);
            let figment = getRandomWord(true);
            while (sentence_length > 0) {
                figment += ' ';
                figment += getRandomWord(false);
                sentence_length-=1;
            }
            figment += PUNCTUATION[getRandom(2, 0)];
            figment += ' ';
            sentence += figment;
        }
        return sentence;
    }
    function getRandomWord(isCapital) {
        // 65 90 a-z
        // 97 122 A-Z
        let word = "";
        if (isCapital) {
            word = String.fromCharCode(getRandom(25, 65));
        }
        for (let i = 0; i < Math.round(Math.random()*5)+5; i++) {
            word += String.fromCharCode(getRandom(25, 97));
        }
        return word;
    }


    (async function() {
        for (let i = 0; i < Math.round(Math.random()*5)+5; i++) {
            images.push(getImage())
        }
        Promise.all(images).then(r => {
            for (const image of r) {
                const userContainer = document.createElement('div');
                userContainer.classList.add('user');
                const imageContainer = document.createElement('img');
                imageContainer.setAttribute('src', image);
                imageContainer.classList.add('image')
                userContainer.appendChild(imageContainer)
                const textContainer = document.createElement('p');
                textContainer.innerText = getParagraph();
                userContainer.appendChild(textContainer);
                MAIN.appendChild(userContainer);
            }
        })
    })()
})