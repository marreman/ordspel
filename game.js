const { log, assert } = console

const test = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(message, actual, expected)
  }
}

const evaluateGuess = (guess, answer) => {
  log("evaluateGuess", guess, answer)

  const colors = Array(guess.length).fill("gray")

  for (let i = 0; i < colors.length; i++) {
    if (guess[i] === answer[i]) {
      colors[i] = "green"
    }
  }

  for (let i = 0; i < answer.length; i++) {
    for (let j = 0; j < guess.length; j++) {
      if (answer[i] === guess[j] && colors[j] !== "green") {
        colors[j] = "yellow"
        break
      }
    }
  }

  for (let i = 0; i < colors.length; i++) {
    if (colors[i] !== "green") continue
    for (let j = 0; j < guess.length; j++) {
      if (guess[j] === guess[i] && colors[j] === "gray") {
        colors[i] = "green-yellow"
        break
      }
    }
  }

  // console.log(result)
  console.log(colors)

  return colors
}

// evaluateGuess("axxxx", "azzzz") // [ "green", "gray", "gray", "gray", "gray" ]
// evaluateGuess("aaxxx", "aazzz") // [ "green", "green", "gray", "gray", "gray" ]
// evaluateGuess("aaaxx", "aazzz") // [ "green", "green", "gray", "gray", "gray" ]
evaluateGuess("axaxx", "aazzz") // [ "green", "gray", "yellow", "gray", "gray" ]
// evaluateGuess("axaxx", "zzzza") // [ "green", "gray", "yellow", "gray", "gray" ]
// evaluateGuess("sirap", "paris") // [ "yellow", "yellow", "green", "yellow", "yellow" ]
evaluateGuess("axxxx", "aazzz") // [ "green-yellow", "gray", "gray", "gray", "gray" ]

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
