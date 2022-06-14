# original-wordle-bot

Attempt to produce a bot that can solve Wordle puzzles better than a human

## Wordle puzzle description

Wordle is an online 5-letter word game. Each day a new word is released and players have six attempts to guess what the word of the day is. Each guess must be a 5-letter word. During the guesses, tiles will change colour to help players get the word. A grey letter means it isn’t in today’s word, whilst a yellow letter signals it is in the word but in the wrong position. Then there’s the green letter which means it’s in the word and in the right place.

## Overall plan

Iteration 1 of the bot will think only one turn at a time (I think that multiple turn thinking would have better performance,
but is likely to be far more complicated). Also, this iteration will require the human to enter the bot's guesses, and report
back information to the bot (input which tiles came back blank, yellow, or green). The first iteration will just use console
prompts and alerts to attain inputs from the user/ communicate with the user.

### Supporting principle

There are a number of different principles I could work from. For iteration 1, I will work from the principle of minimising the expected number of remaining possible 5-letter words (in the English language) after the turn. This seems like it could be optimal (for one turn thinking), and is well defined, but I need to check if it would be feasible. The reasoning behind this is that at the start of each turn, each of the remaining possible words (given previous tile information) are equally  
likely. So the way to have the biggest chance of a correct guess in each round is to have reduced the number of remaining possible words as much as possible in the 
previous round. 

## Functionality plan

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
    Function returns possibleWords[i]

End algorithm

## getNUmberRemainingPossibleWords function

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










