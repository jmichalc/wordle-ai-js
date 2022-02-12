# wordle-ai-js

A JavaScript implementation of my strategy for finding the best first word to guess in Wordle. This is an **O**(n<sup>2</sup>) solution. It is intended to be compatible with "hard mode" gameplay where clues must be preserved from guess-to-guess.

There are two methods you can use:

- `findWord` will get you the best word as quickly as possible, taking about 8.5 seconds on my laptop with an AMD Ryzen 9 5900HX. Your mileage may vary in terms of speed.
- `findWordSlowly` takes longer but produces a sorted list of the dictionary words and their score. You can use that list to check best and worst performing words. It takes around 30 seconds to run for me.

# Overview of Strategy

This strategy works by scoring each word and trying to optimize the choice of word based on that score.

To score a word, we pretend it is our guess and calculate the number of times each type of clue would occur for all possible secret answers. We are interested in worst-case performance, so we score the word based on its worst performing clue. Thus, the score of a word is equal to the number of words for the clue with the highest count.

To choose a word, we pick the word whose score is the lowest. Said another way, we are looking for the word whose worst performing clue is the best among all possible words.

# Result

I pulled the word list from the wordle source code. Wordle keeps a list of all possible words, but answers are pulled from a smaller list, presumably curated so that answers are more guessable. For the purposes of this exercise, I combined both of those lists which can be found in `dictionary.js`.

Here are the 5 best and 5 worst words according to my methodology:

```
Best words:
    serai = 697
    reais = 769
    soare = 769
    paseo = 776
    aeros = 801
Worst words:
    fuzzy = 7875
    hyphy = 8035
    xylyl = 8087
    fuffy = 8158
    gyppy = 8189
```
