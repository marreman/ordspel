export const evaluateGuess = (guess, answer) => {
  const colors = Array(guess.length).fill("gray")

  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === guess[i]) {
      colors[i] = "green"
      continue
    }

    for (let j = 0; j < guess.length; j++) {
      if (answer[i] === guess[j] && i !== j && colors[j] !== "green") {
        colors[j] = "yellow"
        break
      }
    }
  }

  for (let i = 0; i < colors.length; i++) {
    if (colors[i] === "green") {
      const letter = guess[i]
      if (count(letter, guess) < count(letter, answer)) {
        colors[i] = "green-yellow"
        break
      }
    }
  }

  return colors
}

const count = (letter, word) =>
  Array.from(word).filter((l) => l === letter).length
