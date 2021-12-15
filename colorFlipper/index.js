document.addEventListener('DOMContentLoaded', function() {
    function generateRandomNumber(max) {
        return Math.round(Math.random() * max);
    }
    function createRgb() {
        let values = [generateRandomNumber(255), generateRandomNumber(255), generateRandomNumber(255)];
        return {
            values,
            'string': `(${values[0]},${values[1]},${values[2]})`
        };
    }
    function updateMain(rgbCOLOR) {
        if (Math.round(rgbCOLOR.values.reduce((prev, curr) => prev + curr, 0) / 3) <= 125) {
            colorTitle.style.color = 'White';
        } else {
            colorTitle.style.color = 'black';
        }
        main.style.background = `rgb${rgbCOLOR.string}`;
    }
    function toggleButton(button) {
        button.disabled = !button.disabled;
    }
    const button = document.querySelector('#colorButton'); 
    const partyButton = document.querySelector('#partyButton');
    const colorTitle = document.querySelector('#colorTitle');
    const main = document.querySelector('main');
    button.addEventListener('click', function() {
        /*
        Goals:
        1. create color 
        2. Display the color
        3. Figure out what it is
        */
       const rgbCOLOR = createRgb();
        toggleButton(partyButton)
        toggleButton(button)

       fetch(`https://www.thecolorapi.com/id?rgb=${rgbCOLOR.string}`)
       .then(async r => {
           return r.json()
       })
       .then(r => {
            toggleButton(partyButton)
            toggleButton(button)
            let name = r['name']['value'];
            colorTitle.innerText = name;
            updateMain(rgbCOLOR)
       })
       .catch(e => {
           console.log(e)
       })
    })
    let party = {
        stop: false,
        async start() {
            this.stop = false;
            colorTitle.innerText = '!Party!';
            while (true) {
                if (this.stop) {
                    break;
                }
                updateMain(createRgb())
                await new Promise((resolve, reject) => {
                    setTimeout(resolve, 500)
                })
            }
        },
        end() {
            this.stop = true;
            colorTitle.innerText = 'Party Over.'
        }
    };
    let partyActive = false;
    partyButton.addEventListener('click', async function() {
        partyActive = !partyActive;
        toggleButton(button);
        if (partyActive) {
            party.start()
        } else {
            party.end()
        }
    })
})