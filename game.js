const { log, assert } = console

const test = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(message, actual, expected)
  }
}

const evaluateGuess = (guess, answer) => {
  // log({ guess, answer })

  const grays = Array.from(guess).map((letter) => [letter, "gray"])

  const greens = grays.map(([letter, color], i) => [
    letter,
    answer.at(i) === letter ? "green" : color,
  ])

  const yellows = greens.map(([letter, color], i) => [
    letter,
    answer.includes(letter) && color !== "green" ? "yellow" : color,
  ])

  const mixed = yellows.map(([letter, color], i) => [
    letter,
    color === "green" && moreNonYellow(yellows, letter)
      ? "green-and-yellow"
      : color,
  ])

  return mixed
}

const moreNonYellow = (letters, letterToLookFor) => {
  const s = letters.filter(
    ([letter, color]) => color === "yellow" && letter === letterToLookFor
  )

  console.log(letters, letterToLookFor)
}

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

test(
  evaluateGuess("axxxx", "aazzz"),
  [
    ["a", "green"],
    ["x", "gray"],
    ["x", "gray"],
    ["x", "gray"],
    ["x", "gray"],
  ],
  "one for two A, correct place"
)
