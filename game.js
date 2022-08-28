const { log, assert } = console

const test = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(message, actual, expected)
  }
}

const evaluateGuess = (guess, answer) => {
  log("evaluateGuess", guess, answer)

  const letters = Array.from(answer).map((letter, i) => ({
    answer: letter,
    guess: guess[i],
    color: "gray",
  }))

  const greens = letters.map((letter) => ({
    ...letter,
    color: letter.guess === letter.answer ? "green" : letter.color,
  }))
  const yellows = greens.map((letter) => ({
    ...letter,
    color: greens.find((l) => l.guess === letter.answer && l.color !== "green")
      ? "yellow"
      : letter.color,
  }))

  const result = yellows
  const colors = result.map(({ color }) => color)

  console.log(result)
  console.log(colors)

  return colors
}

evaluateGuess("axxxx", "aazzz") // [ "green", "gray", "gray", "gray", "gray" ]
evaluateGuess("aaxxx", "aazzz") // [ "green", "green", "gray", "gray", "gray" ]
evaluateGuess("aaaxx", "aazzz") // [ "green", "green", "gray", "gray", "gray" ]
evaluateGuess("axaxx", "aazzz") // [ "green", "gray", "yellow", "gray", "gray" ]

// test(
//   evaluateGuess("axxxx", "azzzz"),
//   [
//     ["a", "green"],
//     ["x", "gray"],
//     ["x", "gray"],
//     ["x", "gray"],
//     ["x", "gray"],
//   ],
//   "one for one A, correct place"
// )

// test(
//   evaluateGuess("aaxxx", "azzza"),
//   [
//     ["a", "green"],
//     ["a", "gray"],
//     ["x", "gray"],
//     ["x", "gray"],
//     ["x", "gray"],
//   ],
//   "two for two A, one in correct place"
// )

// test(
//   evaluateGuess("axxxx", "aazzz"),
//   [
//     ["a", "green"],
//     ["x", "gray"],
//     ["x", "gray"],
//     ["x", "gray"],
//     ["x", "gray"],
//   ],
//   "one for two A, correct place"
// )
