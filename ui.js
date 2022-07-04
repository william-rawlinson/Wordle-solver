const content = document.querySelector('.content');
const startButton = document.querySelector('.start');
const bannerText = document.querySelector('.bannerText');
const bannerTextString = 'Please use the word displayed below as your guess in the Wordle app. Enter the tile colors Wordle provides by clicking on the letters' +
' below. When you are happy, click Confirm.'; 

startButton.addEventListener('click',onStart);

function onStart(){
    bannerText.textContent = bannerTextString;

    content.removeChild(startButton);

    const paragraph = document.createElement('p');
        paragraph.textContent = 'Guess number 1';
        paragraph.classList.add('turnCounter');
        content.appendChild(paragraph);

    const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttonContainer');
        let idArray = ['first','second','third','fourth','fifth'];
        let letterArray = ['L','A','R','E','S'];
        for (let i =0; i < idArray.length; i++){
            const button = document.createElement('button');
            button.classList.add('letter');
            button.setAttribute('id',idArray[i]); 
            button.classList.add('b');
            button.textContent = letterArray[i];
            buttonContainer.appendChild(button);
        }
        content.appendChild(buttonContainer);

    const confirm = document.createElement('button');
        confirm.classList.add('confirm');
        confirm.textContent = 'Confirm';
        content.appendChild(confirm);
        confirm.addEventListener('click',confirmEvent)

    const letters = document.querySelectorAll('.letter');
        letters.forEach((letter) => {
        letter.addEventListener('click',colorChange);
    })
}

function colorChange(event){
    const clickedButton = document.querySelector(`#${event.currentTarget.id}`);
    if (clickedButton.classList.contains('b')){
        clickedButton.classList.remove('b');
        clickedButton.classList.add('y');
    } else if (clickedButton.classList.contains('y')){
        clickedButton.classList.remove('y');
        clickedButton.classList.add('g');
    } else if (clickedButton.classList.contains('g')){
        clickedButton.classList.remove('g');
        clickedButton.classList.add('b');
    }
}

function confirmEvent(){
    let outputGuess = '';
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter) => {
        outputGuess = outputGuess + letter.textContent;
    })
    outputGuess = outputGuess.toLowerCase();
    console.log(outputGuess);
    let inputBYG = '';
    letters.forEach((letter) => {
            if (letter.classList.contains('b')){
                inputBYG = inputBYG + 'b';
            } else if (letter.classList.contains('y')){
                inputBYG = inputBYG + 'y';
                letter.classList.remove('y');
                letter.classList.add('b');
            } else if (letter.classList.contains('g')){
                inputBYG = inputBYG + 'g';
                letter.classList.remove('g');
                letter.classList.add('b');
            }
    })
    console.log(onConfirmClick(outputGuess, inputBYG)[0]);
    outputGuess = onConfirmClick(outputGuess, inputBYG)[0];
    let idArray = ['first','second','third','fourth','fifth'];
    for (let i = 0; i < idArray.length; i++){
        let elementToChange = document.querySelector(`#${idArray[i]}`);
        elementToChange.textContent = outputGuess[i];
    }
    let text = document.querySelector('.turnCounter');
    let round = text.textContent[text.textContent.length -1];
    round = +round + 1;
    text.textContent = text.textContent.substring(0,text.textContent.length -1) + round;
}

