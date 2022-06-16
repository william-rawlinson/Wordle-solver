function test(k){ // to test function speeds
    let startTime = performance.now();

    for (let i = 1; i <= k; i ++){
        y = isConsistent('alert','bygbb','pxelx');
    }

    let endTime = performance.now();
    console.log(y);
    console.log((endTime - startTime)/1000);
  }

function isConsistentNoRepeats(testWord, currentTilePermutation, compareWord){

let consistencyCheck = 0;

for (let i = 0; i < testWord.length; i ++){

    if (currentTilePermutation[i] == 'b'){
        if (compareWord.includes(testWord[i])) {
            break;
    } 
    } else if (currentTilePermutation[i] == 'y'){
        if (!compareWord.includes(testWord[i])||compareWord[i]==testWord[i]) {
            break;
    }
    } else if (currentTilePermutation[i] == 'g'){
        if (compareWord[i] != testWord[i]) {
            break;
    }
    }
    if (i == 4) {
    consistencyCheck = 1;
    }
}

return consistencyCheck;
} 

function isConsistentWithRepeats(testWord, currentTilePermutation, compareWord){

    let consistencyCheck = 0;

    for (let i = 0; i < testWord.length; i ++){

        if (currentTilePermutation[i] == 'b'){
            if (compareWord.includes(testWord[i])) {
                break;
        } 

        } else if (currentTilePermutation[i] == 'y'){
            if (compareWord.includes(testWord[i])&&compareWord[i]!=testWord[i]) {
                let k = getIndexesOfCharacter(compareWord,testWord[i])

                for (let j = 0; j < k.length; j++){

                    if (currentTilePermutation[k[j]] != 'g'){
                    compareWord = replaceAtStringIndex (compareWord, k[j], '$')
                    }
                 }

            } else {
                break;
            }
        } else if (currentTilePermutation[i] == 'g'){
            if (!(compareWord[i] != testWord[i])) {
                compareWord = replaceAtStringIndex (compareWord, i, '$')
            } else {
                break;
            }
      }
    if (i == 4) {
        consistencyCheck = 1;
      }
    }

    return consistencyCheck;
}

function getIndexesOfCharacter (string, character){
    indexArray = [];

    for (let i = 0; i < string.length; i++){
        if(string[i]==character){
            indexArray.push(i);
      }
    }

    return indexArray;
  }


function replaceAtStringIndex (string, index, character){
    if (index == string.length-1){
        return string.substring(0,index) + character;
    } else {
        return string.substring(0,index) + character + string.substring(index + 1);
    }
  }


function checkRepeatingCharacter(compareWord){
    let restOfWord = '';
    let containsRepeatingCharacter = 0;

    for (let i =0; i < compareWord.length; i ++){
        
        restOfWord = compareWord.substring(i+1);
        // Don't need to look at letters prior to index i, as these have already been checked for repeats
        if (restOfWord.includes(compareWord[i])){
            containsRepeatingCharacter = 1;
            break;
      }
    }

    return(containsRepeatingCharacter);
}




