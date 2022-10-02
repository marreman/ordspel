import { Being } from "./creation.js"

export class Game extends Being {
  constructor() {
    super()
    this.on("begin", () => {
      this.el = document.createElement("div")
      this.el.id = "game"
      this.emit("game element", this.el)
    })
    this.on("new game button element", ({ detail: el }) => this.el.append(el))
    this.on("board element", ({ detail: el }) => this.el.prepend(el))
    this.on("new game button clicked", () => this.emit("new word request"))
  }
}

export class Board extends Being {
  constructor() {
    super()
    this.on("game element", () => {
      this.el = document.createElement("div")
      this.el.className = "board"
      this.emit("board element", this.el)
    })
    this.on("new word", ({ detail: word }) => {
      this.el.innerHTML = ""
      Array.from(word).forEach((_, letterIndex) => {
        this.el.append(new InputSquare(letterIndex).el)
      })
    })
    this.on("letter entered", ({ detail: index }) =>
      this.emit("input focus suggestion", index + 1)
    )
    this.on("letter deleted", ({ detail: index }) =>
      this.emit("input focus suggestion", index - 1)
    )
  }
}

export class InputSquare extends Being {
  constructor(index) {
    super()
    this.index = index
    this.el = document.createElement("input")
    this.el.autocapitalize = "off"

    this.el.addEventListener("keyup", (event) => {
      const key = event.key?.toLowerCase()
      if (/^[abcdefghijklmnopqrstuvwxyzåäö]$/.test(key)) {
        this.el.value = key
        this.emit("letter entered", this.index)
      } else if (
        !this.el.value ||
        event.inputType === "deleteContentBackward"
      ) {
        this.emit("letter deleted", this.index)
      }
    })

    this.on("input focus suggestion", ({ detail: index }) => {
      if (index == this.index) this.el.focus()
    })
  }
}

export class Url extends Being {
  constructor() {
    super()
    this.on("begin", () => {
      const params =
        window.location.search && new URLSearchParams(window.location.search)
      const encodedWord = params && params.get("word").trim()
      const word = encodedWord && atob(decodeURIComponent(encodedWord))
      this.emit("new word", word)
    })
    this.on("new word", ({ detail: word }) => {
      const encodedWord = encodeURIComponent(btoa(word))
      window.history.pushState(null, "", "?word=" + encodedWord)
    })
  }
}

export class Prompter extends Being {
  constructor() {
    super()
    this.on("new word request", () => {
      const newWord = window.prompt("Ange ett nytt ord").toLowerCase().trim()
      this.emit("new word", newWord)
    })
  }
}

export class NewGameButton extends Being {
  constructor() {
    super()
    this.on("begin", () => {
      this.el = document.createElement("button")
      this.el.textContent = "Nytt spel"
      this.el.addEventListener("click", () =>
        this.emit("new game button clicked")
      )
      this.emit("new game button element", this.el)
    })
  }
}
