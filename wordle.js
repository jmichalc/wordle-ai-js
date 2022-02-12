import { default as dictionary } from "./dictionary.js";

const calculateClue = (answer, guess) => {
  let a = [answer[0], answer[1], answer[2], answer[3], answer[4]];
  let g = [guess[0], guess[1], guess[2], guess[3], guess[4]];
  let gClue = 0;
  // check if any letters of guess are GREEN clues
  for (let i = 0; i < g.length; i++) {
    gClue = gClue << 2;
    // if the letters match, mark the letters as used and record a green clue
    if (g[i] === a[i]) {
      a[i] = "\0";
      g[i] = "\0";
      gClue = gClue | 2;
    }
  }
  // check if any remaining letters of guess are YELLOW clues
  let yClue = 0;
  for (let i = 0; i < g.length; i++) {
    yClue = yClue << 2;
    if (g[i] !== a[i]) {
      let index = -1;
      // try to find guess letter [i] in the answer
      for (let j = 0; j < a.length; j++) {
        if (g[i] === a[j]) {
          index = j;
          break;
        }
      }
      // if we found it, mark the answer letter as used and record a yellow clue
      if (index >= 0) {
        yClue = yClue | 1;
        a[index] = "\0";
      }
    }
  }
  return gClue | yClue;
};

// Our strategy is to search for a word which optimizes a score.
// To determine the score for a word, we count how many times each clue could
// possibly occur with the remaining words in the dictionary. The score will be
// equal to the number of words in the worst-performing clue, i.e. the clue
// with the most words. Then, the best word out of all the possibilities will
// be the word with the lowest score.
// This strategy optimizes for the worst-case scenario. We are trying to
// minimize the chances that we will lose.
const findWord = (dictionary) => {
  // we will be tracking the best performing word and its score.
  let bestWord = null;
  let bestScore = Number.MAX_SAFE_INTEGER;
  // go through each word and pretend its the word we are going to guess first.
  for (let i = 0; i < dictionary.length; i++) {
    let guess = dictionary[i];
    let clueMap = {};
    let score = 0;
    // go through each word and pretend its the secret word we are trying to guess
    for (let j = 0; j < dictionary.length; j++) {
      let answer = dictionary[j];
      let clue = calculateClue(answer, guess);
      let clueCount = 1 + (clueMap[clue] ?? 0);
      clueMap[clue] = clueCount;
      score = Math.max(score, clueCount);
      // optimization: if this word can't possibly beat our current best, stop processing it
      if (score >= bestScore) {
        break;
      }
    }
    if (score < bestScore) {
      bestScore = score;
      bestWord = guess;
    }
    if (i % 1000 == 0) {
      console.log(`Processed ${(i / dictionary.length) * 100}% words`);
    }
  }
  return bestWord;
};

// This is an unoptimized version of our strategy that can be used to produce
// a list of the best and worst performming words
const findWordSlowly = (dictionary) => {
  let wordScores = [];
  for (let i = 0; i < dictionary.length; i++) {
    let guess = dictionary[i];
    let clueMap = {};
    let score = 0;
    for (let j = 0; j < dictionary.length; j++) {
      let answer = dictionary[j];
      let clue = calculateClue(answer, guess);
      let clueCount = 1 + (clueMap[clue] ?? 0);
      clueMap[clue] = clueCount;
      score = Math.max(score, clueCount);
    }
    wordScores.push([guess, score]);
    if (i % 1000 == 0) {
      console.log(`Processed ${(i / dictionary.length) * 100}% words`);
    }
  }
  wordScores.sort((a, b) => a[1] - b[1]);
  console.log("Best words:");
  for (let i = 0; i < 5; i++) {
    let [word, score] = wordScores[i];
    console.log(`    ${word} = ${score}`);
  }
  console.log("Worst words:");
  for (let i = wordScores.length - 5; i < wordScores.length; i++) {
    let [word, score] = wordScores[i];
    console.log(`    ${word} = ${score}`);
  }
  let [bestWord, _] = wordScores[0];
  return bestWord;
};

let start = new Date().getTime();
console.log(findWordSlowly(dictionary));
let end = new Date().getTime();
console.log(`Solution took ${end - start} milliseconds to find`);
