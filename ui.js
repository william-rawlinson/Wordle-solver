const content = document.querySelector('.content');
const startButton = document.querySelector('.start')
startButton.addEventListener('click',onStart);



function onStart(){
    content.removeChild(startButton);
    const paragraph = document.createElement('p');
        paragraph.textContent = 'Guess number 1';
    content.appendChild(paragraph);
    const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttonContainer');
        let idArray = ['first','second','third','fourth','fifth'];
        let letterArray = ['L','A','R','E','S'];
        for (let i =0; i < idArray.length; i++){
            const button = document.createElement('button');
            button.classList.add('letter');
            button.setAttribute('id',idArray[i]);
            button.textContent = letterArray[i];
            buttonContainer.appendChild(button);
        }
    content.appendChild(buttonContainer);
    const confirm = document.createElement('button');
        confirm.classList.add('confirm');
        confirm.textContent = 'Confirm';
    content.appendChild(confirm);
}

