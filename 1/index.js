const game = document.getElementById("game")
const state = {
  correctWord: null,
  attemptedWords: null,
  currentAttemptIndex: 0,
  hasWon: false,
}

const view = {
  board() {
    const el = document.createElement("div")
    el.className = "board"
    return el
  },
  bgColor(color) {
    switch (color) {
      case "green":
        return "bg-green"
      case "yellow":
        return "bg-yellow"
      case "green-yellow":
        return "bg-green-and-yellow"
      case "gray":
      default:
        return "bg-gray"
    }
  },
  square(contents, className) {
    const el = document.createElement("div")
    className && el.classList.add("square", className)
    el.appendChild(contents)
    return el
  },
  coloredSquare(letter, letterIndex, colors) {
    const letterEl = document.createElement("span")
    letterEl.textContent = letter ?? ""
    return view.square(letterEl, view.bgColor(colors[letterIndex]))
  },
  inputSquare(letter, letterIndex) {
    const input = document.createElement("input")
    input.autocapitalize = "off"
    input.dataset.index = letterIndex
    input.value = letter ?? ""
    return input
  },
  game() {
    const board = view.board()
    state.attemptedWords.forEach((word, index) => {
      const colors = evaluateGuess(word, state.correctWord)
      if (state.currentAttemptIndex == null) {
        word.forEach((letter, letterIndex) => {
          board.appendChild(view.coloredSquare(letter, letterIndex, colors))
        })
      } else if (index === state.currentAttemptIndex) {
        word.forEach((letter, letterIndex) => {
          const input = view.inputSquare(letter, letterIndex)
          if (letterIndex === 0) input.autofocus = true
          board.appendChild(input)
        })
      } else if (index > state.currentAttemptIndex) {
        word.forEach(() => {
          board.appendChild(
            view.square(document.createTextNode(""), "bg-lighter-gray")
          )
        })
      } else {
        word.forEach((letter, letterIndex) => {
          board.appendChild(view.coloredSquare(letter, letterIndex, colors))
        })
      }
    })

    const button = document.createElement("button")
    button.textContent = "Nytt spel"
    button.addEventListener("click", () => effects.newGame())

    game.replaceChildren(board, button)
    effects.declareWinner()
  },
}

const utils = {
  clamp(min, n, max) {
    return Math.min(Math.max(n, min), max)
  },
  encodeWord(word) {
    return encodeURIComponent(btoa(word))
  },
  decodeWord(word) {
    return atob(decodeURIComponent(word))
  },
}

const actions = {
  startGame(correctWord, numberOfAttempts) {
    state.correctWord = Array.from(correctWord)
    state.attemptedWords = new Array(numberOfAttempts)
      .fill(undefined)
      .map(() => new Array(correctWord.length).fill(undefined))
    state.currentAttemptIndex = 0
  },
  inputLetter(letter, index) {
    state.attemptedWords[state.currentAttemptIndex][index] = letter
  },
  commitAttempt() {
    const currentAttempt = state.attemptedWords[state.currentAttemptIndex]
    if (
      currentAttempt.filter((l) => l && l.trim()).length ===
      state.correctWord.length
    )
      state.currentAttemptIndex += 1
  },
}

const effects = {
  newGame() {
    const word = window.prompt("Ange ett nytt ord")
    window.location.href =
      "?word=" + utils.encodeWord(word.toLowerCase().trim())
  },
  declareWinner() {
    if (state.hasWon) return
    state.attemptedWords.forEach((word, index) => {
      if (
        word.join("") === state.correctWord.join("") &&
        index !== state.currentAttemptIndex
      ) {
        state.hasWon = true
        state.currentAttemptIndex = null
        view.game()
      }
    })
  },
}

document.addEventListener("DOMContentLoaded", () => {
  const params =
    window.location.search && new URLSearchParams(window.location.search)
  const encodedWord = params && params.get("word").trim()
  const correctWord = encodedWord && utils.decodeWord(encodedWord)

  if (!correctWord || correctWord.length !== 5) {
    effects.newGame()
  } else {
    actions.startGame(correctWord, 6)
    view.game()
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault()
    actions.commitAttempt()
    view.game()
  } else if (event.key === "Backspace") {
    event.preventDefault()
    const currentInput = event.target
    const previousInput = currentInput.previousElementSibling
    const currentLetter = getLetter(currentInput)
    const previousLetter = previousInput && getLetter(previousInput)
    if (currentLetter.value) {
      actions.inputLetter("", currentLetter.index)
      currentInput.value = ""
    } else if (previousLetter) {
      actions.inputLetter("", previousLetter.index)
      previousInput.value = ""
    }
    previousInput && previousInput.focus()
  }
})

document.addEventListener("input", (event) => {
  const currentInput = event.target
  const currentLetter = getLetter(currentInput)
  const nextInput = currentInput.nextElementSibling
  actions.inputLetter(currentLetter.value, currentLetter.index)
  currentInput.value = currentLetter.value
  nextInput && nextInput.focus()
})

function getLetter(input) {
  const value = (input.value ?? "").trim().toLowerCase().slice(-1)
  const index = parseInt(input.dataset?.index, 10)

  return { value, index }
}
const evaluateGuess = (guess, answer) => {
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
