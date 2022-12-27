class Emitter {
  constructor() {
    this.listeners = {}
  }

  on(eventName, callback) {
    let listeners = this.listeners[eventName] ?? []
    listeners.push(callback)
    this.listeners[eventName] = listeners
  }

  emit(eventName, ...args) {
    let listeners = this.listeners[eventName]
    if (listeners) {
      this.listeners[eventName].forEach((listener) => listener(...args))
    } else {
      console.log("no listeners for event:", eventName)
    }
  }
}

class View extends Emitter {
  constructor() {
    super()
    this.el = document.createElement(this.tagName)
  }

  get tagName() {
    return "div"
  }
}

class Game extends View {
  constructor() {
    super()

    const word = new Word()
    const newGameButton = new NewGameButton()
    const board = new Board()
    const prompt = new Prompt()

    this.el.id = "game"
    this.el.appendChild(board.el)
    this.el.appendChild(newGameButton.el)
    this.guesses = []

    word.on("change", () => {
      this.guesses = []
      board.render(word, this.guesses)
    })

    newGameButton.on("click", () => {
      word.set(prompt.askForNewWord())
    })

    board.on("guess", (guessedWord) => {
      this.guesses.push(guessedWord)
      board.render(word, this.guesses)
      if (guessedWord === word.value) {
        prompt.alert("Rätt!")
      }
    })

    document.body.appendChild(this.el)

    board.render(word)
  }
}

class Judge {
  static evaluateGuess(guess, answer) {
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
        if (Judge.count(letter, guess) < Judge.count(letter, answer)) {
          colors[i] = "green-yellow"
          break
        }
      }
    }

    return colors
  }

  static count(letter, word) {
    Array.from(word).filter((l) => l === letter).length
  }
}

class NewGameButton extends View {
  constructor() {
    super()
    this.el.textContent = "Nytt spel"
    this.el.addEventListener("click", () => this.emit("click"))
  }

  get tagName() {
    return "button"
  }
}

class Prompt {
  askForNewWord() {
    return window.prompt("Ange ett nytt ord").toLowerCase().trim()
  }

  alert(message) {
    window.alert(message)
  }
}

class Word extends Emitter {
  constructor() {
    super()
    const params =
      window.location.search && new URLSearchParams(window.location.search)
    const encodedWord = params && params.get("word").trim()
    const decodedWord = encodedWord && atob(decodeURIComponent(encodedWord))
    this.value = decodedWord
  }

  set(newWord) {
    this.value = newWord
    const encodedWord = encodeURIComponent(btoa(this.value))
    window.history.replaceState(null, "", "?word=" + encodedWord)
    this.emit("change", this.value)
  }
}

class Board extends View {
  constructor() {
    super()
    this.el.className = "board"
  }

  render(word, guesses = []) {
    this.el.innerHTML = ""
    this.el.style.gridTemplateColumns = `repeat(${word.value.length}, 1fr)`
    this.renderGuesses(word, guesses)
    for (const index in word.value) {
      const letterInput = new LetterInput(index)

      letterInput.addEventListener("letter-entered", () => {
        document.activeElement.nextSibling?.focus()
      })

      letterInput.addEventListener("letter-deleted", () => {
        document.activeElement.previousSibling?.focus()
      })

      letterInput.addEventListener("enter-pressed", this.guess.bind(this))

      this.el.appendChild(letterInput)
    }
  }

  renderGuesses(word, guesses) {
    for (const guess of guesses) {
      const bgColors = Judge.evaluateGuess(guess, word.value).map(
        this.getBgFromColor
      )
      for (const letterIndex in guess) {
        const div = document.createElement("div")
        div.classList.add("square", bgColors[letterIndex])
        div.textContent = guess[letterIndex]
        this.el.appendChild(div)
      }
    }
  }

  getBgFromColor(color) {
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
  }

  guess() {
    let word = ""
    for (let letterInput of this.el.querySelectorAll("input")) {
      word += letterInput.value
    }

    this.emit("guess", word)
  }
}

class LetterInput extends HTMLInputElement {
  constructor() {
    super()
    this.autocapitalize = "off"
  }

  connectedCallback() {
    this.addEventListener("keydown", this.handleKeyDown)
  }

  handleKeyDown(event) {
    event.preventDefault()

    if (/^[a-zA-ZåäöÅÄÖ ]$/.test(event.key)) {
      this.value = event.key
      this.dispatchEvent(new CustomEvent("letter-entered"))
    } else if (event.key === "Backspace") {
      this.value = ""
      this.dispatchEvent(new CustomEvent("letter-deleted"))
    } else if (event.key === "Enter") {
      this.dispatchEvent(new CustomEvent("enter-pressed"))
    }
  }
}

customElements.define("letter-input", LetterInput, { extends: "input" })

new Game()
