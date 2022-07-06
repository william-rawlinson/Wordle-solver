# My Wordle Solver

I built an application to solve the popular puzzle game 'Wordle' in JavaScript. This was to test problem solving strategies and basic UI functionality that I've learnt in the Project Odin Foundation Course. The current version of the application is v1.0, for this version I have not yet considered optimisation.

## What is 'Wordle'?

Link to Wordle: [click here to try the game](https://www.nytimes.com/games/wordle/index.html)

Wordle is an online game developed by the New York Times that is designed to test vocabulary. Each day a new word is chosen as a solution, and players have six attempts to guess the word. Each guess returns information in the form of coloured tiles; a green tile indicates a letter that is in the right place, a yellow tile indicates a letter that is in the wrong place, and a blank tile indicates the letter is not in the solution word.

## My Approach

I wanted to create an effective solver that was close to an optimal strategy. After some thinking I chose the following principle as the basis for my solver:

    My solver will minimise the expected number of possible solution words after each guess has been made

The reasoning behind this principle is that at the start of each turn, each of the remaining possible words are equally likely to be the solution. Therefore, to have the best chance of guessing the solution, the solver should minimise the number of remaining possible words after each guess. As a simplification, I chose to rely on 'one-turn thinking'. This means that the solver would not try and think more than one turn ahead when choosing the next word. 

For version 1.0 of the solver, I aimed to produce an application that the user could interact with in a web browser. For future versions, I will optimise the solution algorithms and add a progress bar to visualise how long the algorithms have left to run. I attempted to add this progress bar for v1.0, but was not able to both return the next guess word and update the DOM whilst my algorithms are running.

## Results

Version 1 of my solver has performed very well. I've used the solver 4 times, and have found the solution in 2 guesses, 3 guesses, 4 guesses, and 3 guesses, respectively. My solver has identified the word 'lares' as the optimal first guess. This is an obscure word referring to guardian deities in ancient Roman religion.

# Working 

Variable definitions 

- currentWord, a string, stores the current guess that was suggested by the solver.  
- nextWord, a string, stores the next guess that will be suggested to the user. 
- inputBYG, a string, stores the tile colours returned by Wordle for the current guess as a 5 letter string of form 'ybgyb'.  
- possibleWords, an array, stores all of the possible solution words, given tile information that has been returned by Wordle. The initial value is all of the five letter words in the English language, this is reduced each turn to hold only words that are consistent with the tile information that has been returned.

## Plan - getNextWord()

This is a function that generates nextWord based on possibleWords. As specified above, the principle behind this function should be to minimise the expected number of possible solution words after the guess has been made.  

A resource intensive method could work based on the following. Each guess has a range of tile colour outcomes, symbolised by a 5 letter combination (i.e. 'ybbbb' is the outcome that only the first letter of the guess is in the solution, and it's in the wrong place). Given a guess word, each of these tile colour outcomes has a probability, 'x/y', which can be calculated from the number of words in possibleWords that are consistent with that tile colour outcome and that guess 'x', divided by the total number of words in possibleWords 'y'. Each outcome also has an associated number of possible words remaining following the turn. This is just equal to 'x'. Therefore, the contribution to the total expected number of remaining possible words for a given guess word, and a specific tile outcome, is 'x^2/y'. There are z possible tile colour outcomes for each guess. This is the number of permutations of 'bygyb' where each character can take 'b', 'y', 'g'. Therefore, z = 3^5 = 243. The function could try each word in possibleWords as a guess. For each of these words, the function could calculate the expected number of possible solution words after the guess has been made by summing over the 'x^2/y' contributions from each of the 243 possilbe tile colour outcomes. In this way, the guess word with the lowest expected number of possible solution words after the guess has been made can be identified. This would be the next outputGuess, and would be returned by getNextWord() as a string.

## Plan - Creating an Array of Possible Tile Colours

In the function getNextWord(), I will need to cycle through different permutations of tile outcomes. There are 3^5 = 243 permutations of 5 tiles that can be green, yellow, or blank. To build an array containing each of these permutations in the form 'ybgby', I can use logic based on a combination lock. If you have a combination lock with 3 slots, and 0-9 in each slot, you have 10^3 permutations (i.e. 1,000). These can be formed in a systematic way by considering the 'total' number displayed by the lock and going from '000' to '999' in incremental steps. For example, the first three permutations would be: 001, 002, 003. The last three permutations would be: 997, 998, 999. This just involves changing the third slot every step, changing the second slot every 10th step, and changing the third slot every 100th step.

For our problem, we have 5 slots, that can take 'g', 'b', or 'y'. So we can start from 'ggggg' and work up to 'bbbbb' changing the fifth slot every time (cycling through 'g', 'y', 'b'), changing the fourth every 3rd time, the third every 9th times, the second every 27th time and the first every 81 times.

    Code this led to:

    function getTilePermutations (){ // Generates tilePermutations, which are all the possible tile colours Wordle could return
        let tilePermutations = ['ggggg']; // g = green, y = yellow, b = blank
        let activePermutation = 'ggggg'
        for (let i = 1; i < 243; i++){
            activePermutation[4]=='g'? activePermutation = replaceAtStringIndex(activePermutation,4,'y'):
            activePermutation[4]=='y'? activePermutation = replaceAtStringIndex(activePermutation,4,'b'):
            activePermutation = replaceAtStringIndex(activePermutation,4,'g');
            if (i % 3 == 0){
                activePermutation[3]=='g'? activePermutation = replaceAtStringIndex(activePermutation,3,'y'):
                activePermutation[3]=='y'? activePermutation = replaceAtStringIndex(activePermutation,3,'b'):
                activePermutation = replaceAtStringIndex(activePermutation,3,'g');
            }
            if (i % 9 == 0){
                activePermutation[2]=='g'? activePermutation = replaceAtStringIndex(activePermutation,2,'y'):
                activePermutation[2]=='y'? activePermutation = replaceAtStringIndex(activePermutation,2,'b'):
                activePermutation = replaceAtStringIndex(activePermutation,2,'g');
            }
            if (i % 27 == 0){
                activePermutation[1]=='g'? activePermutation = replaceAtStringIndex(activePermutation,1,'y'):
                activePermutation[1]=='y'? activePermutation = replaceAtStringIndex(activePermutation,1,'b'):
                activePermutation = replaceAtStringIndex(activePermutation,1,'g');
            }
            if (i % 81 == 0){
                activePermutation[0]=='g'? activePermutation = replaceAtStringIndex(activePermutation,0,'y'):
                activePermutation[0]=='y'? activePermutation = replaceAtStringIndex(activePermutation,0,'b'):
                activePermutation = replaceAtStringIndex(activePermutation,0,'g');
            }
            tilePermutations.push(activePermutation)
        }
        return tilePermutations
    }

## Plan - Checking Consistency

getNextWord() will need sub-functions to check whether a solution word (taken from possibleWords) is consistent with a guess and a tile colour outcome. For example, this question takes the form: 'Is the solution word 'break' consistent with the guess 'prior' and the tile colour outcome 'ggbbb''. Thinking about this problem, the tile colours returned by Wordle are returned according to some well defined rules. Therefore, we just need to check that those rules haven't been violated. 

There are two sets of rules. These depend on whether the guess word contains repeating letters or not. For the function that checks consistency, I will build in an initial check for whether the word contains repeating letters, and apply the relevant set of rules based on that.

1. For the case where the given letter does not appear more than once in the guess word:  

'b' a blank tells you that the given letter in the guess word is not in the solution word  
'g' a green tells you that the given letter in the guess word is in the solution word in the exact same index  
'y' a yellow tells you that the given letter is in the solution word, but is not in the same index as it appears for the guess word  

2. For the case where the given letter does appear more than once in the guess word:   

These are a little tricky to spell out. Essentially, a letter can only be given a 'y' or 'g' tile colour for as many times as it appears in the solution word. For example, if the solution word is 'break' and the guess word is 'prior', a yellow will not be returned for the last 'r' in 'prior', as the first 'r' in prior is assigned a 'g', and there is only one 'r' in break. The rules are effectively:

'b' a blank tells you that the given letter in the guess word is not in the solution word OR that this letter type has already been assigned 'g's or 'y's   equal to the number of times it occurs in the solution word  
'g' a green tells you that the given letter in the guess word is in the solution word in the exact same index  
'y' a yellow tells you that the given letter is in the solution word, but is not in the same index as it appears for the guess word  

The above rules do not translate so simply into checks to perform. Thinking about how to capture these rules, the difference from the first set of rules really boils down to the fact that we need to account for letters in the solution word being 'used up' by 'g' or 'y' tiles. I can account for this by changing tiles in the solution word after they have been 'used' to a '$' so that they are no longer picked up by checks such as .includes() for letters further along in the guess. When a 'y' is returned, I will need to be careful not to change letters in the solution word that correspond to a 'g' tile colour to '$', as this could break a subsequent 'g' check. 

    Code this led to:

    Case with no repeating letters

    function isConsistentNoRepeats(testWord, currentTilePermutation, compareWord){ // isConsistent where the testWord doesn't contain duplicate letters
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
    
    Case with repeating letters

    function isConsistentWithRepeats(testWord, currentTilePermutation, compareWord){ // isConsistent where the testWord does contain duplicate letters i.e. 'pretty'
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




