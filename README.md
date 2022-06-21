# My Wordle Solver

I built an application to solve the popular puzzle game 'Wordle' in JavaScript. This was to test problem solving strategies I've learned in the Project Odin Foundation Course.

## What is 'Wordle'?

Link to Wordle: [click here to try the game](https://www.nytimes.com/games/wordle/index.html)

Wordle is an online game developed by the New York Times that is designed to test vocabulary. Each day a new word is chosen as a solution, and players have six attempts to guess the word. Each guess returns information in the form of coloured tiles; a green tile indicates a letter that is in the right place, a yellow tile indicates a letter that is in the wrong place, and a blank tile indicates the letter is not in the solution word.

## My Approach

I wanted to create an effective solver that was close to an optimal strategy. After some thinking I chose the following principle as the basis for my solver:

    My solver will minimise the expected number of possible solution words after each guess has been made

The reasoning behind this principle is that at the start of each turn, each of the remaining possible words are equally likely to be the solution. Therefore, to have the best chance of guessing the solution, the solver should minimise the number of remaining possible words after each guess. As a simplification, I chose to rely on 'one-turn thinking'. This means that the solver would not try and think more than one turn ahead when choosing the next word. For version 1 of the solver, I aimed to produce a function that the user could interact with in a web browser's developer tool console. For future versions, I aim to add a UI so that the user can interact with the solver in a web browser.

## Results

Version 1 of my solver has performed very well. I've used the solver 4 times, and have found the solution in 2 guesses, 3 guesses, 4 guesses, and 3 guesses, respectively. My solver has identified the word 'lares' as the optimal first guess. This is an obscure word referring to guardian deities in ancient Roman religion.

# Detailed Working Below

I'm going to assume that I can find an optimal first turn word 
choice (as this will be the same every time) outside of this algorithm.

The bot will alert the user to the optimal first turn word. The user will enter this into the Wordle app.  
The Wordle app will return which tiles were blank, which were yellow, and which were green.
The user will input which tiles are blank, yellow, or green by entering a string of the form 'bbygb' into a prompt (example  
translates to first tile blank, second tile blank, third tile yellow, fourth tile green, fifth tile blank).
The bot will use this input to calculate the optimal second word choice, and will produce an alert containing the 
optimal second word choice. This will continue until either the user inputs 'ggggg' or until the sixth guess is 
given as an alert. (For future iterations, the bot will have a functionality to record its win/loss ratio).

## Algorithm

Variables

variable round, type int
variable outputGuess, type string
variable inputBYG, type string
constant firstWord, string containing optimal first turn word  
Array enteredWords, Each entry is a word that was entered, entry 1 is the first word etc.  
Array returnedBYG,  Each entry is a string standing for blank, yellow, or green, that specifies the tile information. Entry 1 is for the first entered word.  
Array fiveLetterWordLibrary, Stores all five-letter words in the English dictionary.
Array possibleWords, stores the remaining possible words, initial contents are the same as fiveLetterWordLibrary. 
variable evCount, stores the expected value of remaining words for a given testWord
variable bestEvCount, stores the current lowest expected value of remaining words whilst possibleWords is fed into getNextWord
variable lengthPossibleWords, length of the possibleWords array
variable currentOptimalGUess, tracks the index of the current optimal word (in the possibleWords array) whilst the possibleWords array is fed into getNextWord
Array tilePermutations, stores possible tile color permutations (i.e, 'ygbbb')
variable currentTilePermutation = 0
variable runningEvCount = 0, stores evCount whilst looping over tilePermutations in getEvCount
variable runningConsistentWords = 0, stores number of consistent words whilst looping over possibleWords in getNumConsistentWords
variable consistencyCheck = 0, stores whether word is conistent or inconsistent, within function isConsistent

Algorithm for wrapper function

    For loop, initialize i = 1, condition i < 7, increment + 1

    OutputGuess is set equal to getNextWord(enteredWords, returnedBYG, fiveLetterWordLibrary, possibleWords). This function  
    calculates the word that will minimise the expected number of remaining possible 5-letter words, and returns this as a string.
    This function returns firstWord when the round counter is 1. 
    possibleWords is set equal to function getPossibleWords(possibleWords, enteredWords, returnedBYG). 
    function storeEnteredWord fills row i of enteredWords to match outputGuess.  
    Alert is given, asking user to use outputGuess as their turn guess.  
    User is prompted for the tile information they received from Wordle. Input is stored in inputBYG.  
    function storeReturnedBYG fills row i of returnedBYG to match inputBYG.  
    break condition, if inputBYG == 'ggggg' 

End algorithm

## getNextWord function

getNextWord(enteredWords, returnedBYG, fiveLetterWordLibrary, possibleWords, lengthPossibleWords)

First stab, resource intensive method:

Each word has a range of outcomes, symbolised by a 5 letter combination (i.e. ybbbb is the outcome that only the first letter is in the solution, and it's in the wrong place). Each outcome has a probability, x/y which can be calculated based on how many of the remaining possible words fit the tile information (x) and on how many words are in the remaining possible word set (y). I.e. in this case, how many of the remaining possible words contain just the first letter, and not in the first position. The outcome also has an associated size of remaining words following the turn. Conveniently, this is equal to the numerator of the probability of the outcome (x). So the contribution from a given outcome to the expected number of remaining possible words is x^2/y. There are z possible outcomes for each word (permutations of byg in 5 slots) where z = 3^5 = 243. This method would require, for each word (say 1,000) running through 243 possible outcomes, where to calculate the contribution from each outcome it is required to check all remaining words (1,000) against the outcome. So this would require 1000 * 243 * 1000 checks. 

algorithm for getNextWord(enteredWords, returnedBYG, fiveLetterWordLibrary, possibleWords, lengthPossibleWords) 

    bestEvCount = 999999999 (set bestEvCount so high that first word is guaranteed to have lower evCount)
    currentOptimalGuess = 0

    for loop, (initialisation i = 0, condition i < lengthPossibleWords; increment i + 1)

    possibleWords[i] represents the candidate word for selection as outputGuess
    In this for loop, we calculate the total evCount for each word possibleWords[i].
    We then compare this to bestEvCount. If evCount is lower than bestEvCount, then
    bestEvCount is set equal to evCount, and currentOptimalGuess is set equal to i.
    Otherwise, nothing happens
    evCount = getEvCount(possibleWords[i],possibleWords)
    if (evCount < bestEvCount) then set bestEvCount = evCOunt and currentOptimalGuess = i
    Otherwise do nothing

    end for loop

    Function returns possibleWords[currentOptimalGuess]

End algorithm

## getEvCount function

function getEvcount(testWord, possibleWords)

takes a word in possibleWords as input, and calculates evCount for that word.
evCount is the expected number of remaining possible words after that word guess.
evCount is a sum over the contributions from each possible ybg combination (i.e. each set of tile color information). Each contribution
As given above, each contribution is calculated as x^2/y, where x = number of words in possibleWords that are consistent with that tile information
and where y = lengthPossibleWords.
However, there may be a complexity. What is the contribution for the 'ggggg' permutation? the number of remaining possible words could be thought of as 1 or it
could be thought of as 0. For now, I will allow for this permutation to count as 1 remaining possible word, for simplicty in the algorithm. Therefore,
this will give a contribution of 1/y for all testWords. This shouldn't change anything with what comes out as the optimal guess


algorithm for getEvCount(testWord, possibleWords)

    for loop, initialisation i = 0, condition i < lengthTilePermutations, increment i + 1

    set currentTilePermutation = tilePermutations[i]
    runningEvCount = runningEvCount + (getNumConsistentWords (testWord, currentTilePermutation, possibleWords))^2/lengthPossibleWords

    end for loop

    function returns running evCount

## getNumConsistentWords function

function getNumConsistentWords(testWord, currentTilePermutation, possibleWords)

takes a test word, a set of tile information as input (i.e. five letter string representing color information 'ygbgb'), and the remaining possible words
and counts how many of the possibleWords array are consistent with the test word and that tile information.

The first version will be slow on computing time, so lets just compare the testWord and currentTilePermutation to one word at a time in possible words. So we need to figure a way to compare testWord to a single word in possibleWords, and tell if it is consitent with test word and currentTilePermutation. currentTilePermutation gives us rules: if we have blanks, they tell us that the possibleWord can't have those letters. If we have yellows, these tell us the PossibleWord must have that letter, if we have greens that tells us the possible word must have that letter in that location. We can take each letter of testWord and apply the rule suggested by that letter and the corresponding index of currentTilePermutation, to the word we are comparing to, to see if it is consistent with that rule. (although we will
need to be careful for testWords that contain repeat letters, as there are some nuances here). So say we have the word 'alert' and 'bgybg'. The first b implies the possible word must not contain the 'a', so we apply that rule. if it were y in letter 1, we must check that the possible word does contain
'a', if it were g in letter 1, the possible word must contain 'a' as its first letter. I can see that this algorithm is going to take lots of computing 
time to run, but that there will be some really interesting ways to speed it up (for example, what order to apply rules? we would decide on what is most likely to rule a word out).

Algorithm for method as described above

getNumConsistentWords(testWord, currentTilePermutation, possibleWords)

    for loop, initialisation i = 0, conditon i < lengthPossibleWords, increment i + 1

    runningConsistentWords = runningConsistentWords + isConsistent(testWord, currentTilePermutation, possibleWords[i])

    end for loop

    return runningConsistentWords

End function


## function isConsistent(testWord, currentTilePermutation, compareWord)

This function will take testWord (string), and currentTilePermutation (string), and will output 1 if compareWord is consistent with that testWord/
currentTilePermutation and 0 otherwise. I'll first write an algorithm for the case where we don't have repeating letters, and then the case where 
we do have repeating letters (more nuanced)

Algorithm for isConsistentNoRepeats.

isConsistent algorithm (not considering testWord with repeating letters)

    for loop, initialisation i = 0, condition i < 5, increment i + 1

        let consistencyCheck = 0
        if currentTilePermutation[i] == b then if compareWord.includes(testWord[i]) is true exit loop
        if currentTilePermutation[i] == y then if compareWord.includes(testWord[i]) is false or compareWord[i] == testWord[i] is true exit loop
        if currentTilePermutation[i] == g then if compareWord[i] == testWord[i] is false exit loop
        otherwise consistencyCheck = 1

    end for loop

    return consistencyCheck

I've written this in code and I'm going to try this out and test computing time. I've implemented an isConistent function that takes 111 seconds to run
243 million comparisons (which is an 1000 remaining words case, as described above). Lot's of optimisation to do but not impossible i think!

Why repeated letters can cause issues:

say you enter the word 'petty' and the word is 'trait'. you would get
two yellows for 'bbyyb'. But a word like 'triii' shouldn't be consistent and
the above algorithm would say it is. The isConsistent algorithm isn't working
for situations where you have multiple of the same letters returning yellows. 
The world game works so that it only gives you a yellow if you haven't already been given a yellow or green for all the instances
of that letter contained in the solution.

To check whether we need to deal with this nuanced case, we should check for if the word contains a repeat letter.
strictly speaking we could narrow this condition down but for now I'm just going to go for this wide condition
as it would catch any problem case (optimisation later).

I've had a think about ways to deal with all the possible nuances of repeated letters, and the problem really boils down to the fact
that letters everywhere in the word are still 'active' or 'present' to the .includes() searches for the second condition
of isConsistent, even if they have already been 'used' by a green or yellow tile. So a simple solution to this
is to change tiles after they have been 'used' to a '$' so that they are no longer active in the word. There is one
added complexity, when dealing with a yellow, I will need to avoid changing tiles to '$' if they correspond to a 'g' 
in currentTilePermutation, as this would break the subsequent 'g' check. I'd need to remove other tiles with the same
letter that don't correspond to a 'g'.

Algorithm for isConsistentWithRepeats (now considering edge cases with repeated letters)

isConsistentWithRepeats

    for loop, initialisation i = 0, condition i < 5, increment i + 1

        let consistencyCheck = 0
        if currentTilePermutation[i] == b then if compareWord.includes(testWord[i]) is true exit loop

        if currentTilePermutation[i] == y then if compareWord.includes(testWord[i]) is true and compareWord[i] == testWord[i] is false
        then alter the compare word exchanging a tile with the same letter as testWord[i] that isn't in an index corresponding to a 'g'
        with a '$' symbol
        otherwise exit loop

        if currentTilePermutation[i] == g then if compareWord[i] == testWord[i] is true, then exchange compareWord[i] with a '$' sign
        otherwise exit loop

        otherwise consistencyCheck = 1

    end for loop

    return consistencyCheck


## Generating tilePermutations

tile permutations is an array storing all the possible permutations of tile information, each permutation as a string. 
For example 'ggggg', 'yyyyy','ybygy' etc. There are 3^5 permutations. I'm going to design a function that can build this
array.

Plan - ideas

For permutations, order matters. They work in the same way as a confusingly named 'combination' lock. If you have a combination
lock with 3 slots, and 0-9 in each slot, you have 10^3 permutations (i.e. 1,000). These can be formed in a systematic way by
considering the 'total' number and going from 000 to 999 in incremental steps. I.e. 001, 002, etc.

I think we can take a similar approach for this problem. We have 5 slots, each can take any of three letters. We can choose 
'g' as the base (i.e. equivalent to 0), 'y' as equivalent to 1, and 'b' as equivalent to 2. Then we can work in incremental
steps from 'ggggg' to 'bbbbb'. So this would be 'ggggg', 'ggggy', 'ggggb', 'gggyg', 'gggyy','gggyb', 'gggbg' etc.

So the algorithm just needs to systematize this process. I think we could do this with 5 for loops, I'll go with this for now 
it may not be the most elegant solution but it should work.

Plan - workings

The algorithm will work with a for loop. The loop will have actions associated with one of the 5 slots of the permutation string.
The algorithm will start with a tilePermutations array with the 'ggggg' string in the first index. 
The algorithm will work on a string 'activePermutation', each step will alter this by one character, and then push the 
resulting activePermutation as the next index of tilePermutations array. 
The first loop will change this to 'ggggy' and push this string to form the second index of the tilePermutations
array. The loop will need to change the last slot every time, the second slot will need to change every 3rd time, the third
slot will need to change every 9th time etc. All the way up to the fifth slot that will need to change every 81 times

## getTilePermutations algorithm

getTilePermutations()

tilePermutations = array containing one element 'ggggg'
activePermutation = 'ggggg'

for loop ,initlialisation i = 1, condition i <243, increment i + 1

activePermutation[4]=='g'? replce active Permutation[4] with 'y': 
activePermutation[4]=='y'? replace active Permutation [4] with 'b':
replace active Permutation[4] with 'g'

if (i % 3 == 0){

activePermutation[3]=='g'? replce active Permutation[3] with 'y': 
activePermutation[3]=='y'? replace active Permutation [3] with 'b':
replace active Permutation[3] with 'g'

}

if (i% 9 == 0) {

activePermutation[2]=='g'? replce active Permutation[2] with 'y': 
activePermutation[2]=='y'? replace active Permutation [2] with 'b':
replace active Permutation[2] with 'g'

}

if (i% 27 == 0) {

activePermutation[1]=='g'? replce active Permutation[1] with 'y': 
activePermutation[1]=='y'? replace active Permutation [1] with 'b':
replace active Permutation[1] with 'g'

}

if (i% 81 ==0){

activePermutation[0]=='g'? replce active Permutation[0] with 'y': 
activePermutation[0]=='y'? replace active Permutation [0] with 'b':
replace active Permutation[0] with 'g'

}

push activePermutation to tilePermutations



}


