document.addEventListener('DOMContentLoaded', function() {

    /*
    Todo:
    - implement a queue stack for iterating over users
    */

    const MAIN = document.querySelector('main');
    const REVIEW_CONTAINER = document.querySelector('#reviewContainer');
    const PUNCTUATION = ['.', '!', '?'];
    let images = [], currentImage = null;

    const NAVIGATION = document.querySelectorAll('#navigation button');
    const TOGGLE_NEXT = function() {
        NAVIGATION[1].disabled = !NAVIGATION[1].disabled;
    }
    const TOGGLE_PREV = function() {
        NAVIGATION[0].disabled = !NAVIGATION[0].disabled;
    }


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

        // disabling previous and next buttons
        TOGGLE_PREV()
        TOGGLE_NEXT()

        Promise.all(images).then(r => {
            r.forEach((image, index) => {
                const userContainer = document.createElement('div');
                userContainer.classList.add('user');
                const imageContainer = document.createElement('img');
                imageContainer.setAttribute('src', image);
                imageContainer.classList.add('image')
                userContainer.appendChild(imageContainer)
                const textContainer = document.createElement('p');
                textContainer.innerText = getParagraph();
                userContainer.appendChild(textContainer);
                REVIEW_CONTAINER.appendChild(userContainer);
                images[index] = userContainer;
            })
            // display the middle review of all reviews
            currentImage = Math.floor(images.length / 2);
            for (let i = 0; i < currentImage; i++) {
                images[i].style.display = 'none';
            }

            // enabling previous and next buttons
            TOGGLE_PREV()
            TOGGLE_NEXT()

            document.querySelector('.loading').style.animationPlayState = 'paused';
            REVIEW_CONTAINER.removeChild(document.querySelector('.loading'))
        })
    })();

    function next() {
        images[currentImage].style.display = 'none';
        currentImage += 1;
        if (currentImage === images.length - 1 || NAVIGATION[1].disabled) {
            TOGGLE_NEXT();
        }
        if (NAVIGATION[0].disabled) {
            TOGGLE_PREV();
        }
    }
    function prev() {
        images[currentImage-1].style.display = 'flex';
        currentImage -= 1;
        if (currentImage == 0 || NAVIGATION[0].disabled) {
            TOGGLE_PREV();
        }
        if (NAVIGATION[1].disabled) {
            TOGGLE_NEXT();
        }
    }
    NAVIGATION[0].addEventListener('click', prev)
    NAVIGATION[1].addEventListener('click', next)

})
