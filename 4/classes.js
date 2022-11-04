

export class Game {
  epoch({ emit }, el) {
    this.el = document.createElement("div")
    this.el.id = "game"
    el.append(this.el)
    emit("game")
  }

  new_game_button(ctx, el) {
    this.el.append(el)
  }

  board(_, el) {
    this.el.prepend(el)
  }
}

export class NewGameButton {
  game(ctx) {
    this.el = document.createElement("button")
    this.el.textContent = "Nytt spel"
    this.el.addEventListener("click", () => ctx.emit("new_game_button_clicked"))
    ctx.emit("new_game_button", this.el)
  }
}

export class URL {
  game(ctx) {
    const params =
      window.location.search && new URLSearchParams(window.location.search)
    const encodedWord = params && params.get("word").trim()
    const decodedWord = encodedWord && atob(decodeURIComponent(encodedWord))
    ctx.emit("word", decodedWord)
  }
  word(_, word) {
    const encodedWord = encodeURIComponent(btoa(word))
    window.history.pushState(null, "", "?word=" + encodedWord)
  }
}

export class Prompt {
  new_game_button_clicked({ emit }) {
    const newWord = window.prompt("Ange ett nytt ord").toLowerCase().trim()
    emit("word", newWord)
  }
}

export class Board {
  game({ emit }) {
    this.el = document.createElement("div")
    this.el.className = "board"
    emit("board", this.el)
  }

  word({ emit, create }, word) {
    this.el.innerHTML = ""
    for (const index in word) {
      // const l = Object.create(letter_input)
      // l.index = index
      create(LetterInput, parseInt(index))
      // emit("letter_index", parseInt(index))
    }
  }

  letter_input(_, el) {
    this.el.append(el)
  }

  letter_entered({ emit }, index) {
    emit("input_focus_suggestion", index + 1)
  }

  letter_deleted({ emit }, index) {
    emit("input_focus_suggestion", index - 1)
  }
}

class LetterInput {
  constructor({ emit }, index) {
    this.index = index
    this.el = document.createElement("input")
    this.el.autocapitalize = "off"
    this.el.addEventListener("keyup", (event) => {
      const key = event.key?.toLowerCase()
      if (/^[abcdefghijklmnopqrstuvwxyzåäö]$/.test(key)) {
        this.el.value = key
        emit("letter_entered", this.index)
      } else if (
        !this.el.value ||
        event.inputType === "deleteContentBackward"
      ) {
        emit("letter_deleted", this.index)
      }
    })

    emit("letter_input", this.el)
  }

  input_focus_suggestion(_, index) {
    if (index == this.index) this.el.focus()
  }
}
