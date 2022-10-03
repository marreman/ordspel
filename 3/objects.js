export const game = {
  epoch({ emit }, el) {
    this.el = document.createElement("div")
    this.el.id = "game"
    el.append(this.el)
    emit("game")
  },

  new_game_button(ctx, el) {
    this.el.append(el)
  },

  board(_, el) {
    this.el.prepend(el)
  },
}

export const newGameButton = {
  game({ emit }) {
    this.el = document.createElement("button")
    this.el.textContent = "Nytt spel"
    this.el.addEventListener("click", () => emit("new_game_button_clicked"))
    emit("new_game_button", this.el)
  },
}

export const url = {
  game({ emit }) {
    const params =
      window.location.search && new URLSearchParams(window.location.search)
    const encodedWord = params && params.get("word").trim()
    const decodedWord = encodedWord && atob(decodeURIComponent(encodedWord))
    emit("word", decodedWord)
  },
  word(_, word) {
    const encodedWord = encodeURIComponent(btoa(word))
    window.history.pushState(null, "", "?word=" + encodedWord)
  },
}

export const prompt = {
  new_game_button_clicked({ emit }) {
    const newWord = window.prompt("Ange ett nytt ord").toLowerCase().trim()
    emit("word", newWord)
  },
}

export const board = {
  game({ emit }) {
    this.el = document.createElement("div")
    this.el.className = "board"
    emit("board", this.el)
  },

  word({ emit }, word) {
    this.el.innerHTML = ""
    for (const index in word) emit("letter_index", parseInt(index))
  },

  letter_input(_, letter_input) {
    this.el.append(letter_input.el)
  },

  letter_entered({ emit }, index) {
    emit("input_focus_suggestion", index + 1)
  },

  // this.on("letter deleted", ({ detail: index }) =>
  //   this.emit("input focus suggestion", index - 1)
  // )
}

export const letter_input = {
  letter_index({ emit }, index) {
    const copy = Object.create(this)
    copy.index = index
    copy.el = document.createElement("input")
    copy.el.autocapitalize = "off"
    copy.el.addEventListener("keyup", (event) => {
      const key = event.key?.toLowerCase()
      if (/^[abcdefghijklmnopqrstuvwxyzåäö]$/.test(key)) {
        copy.el.value = key
        emit("letter_entered", copy.index)
      } else if (
        !copy.el.value ||
        event.inputType === "deleteContentBackward"
      ) {
        emit("letter_deleted", copy.index)
      }
    })
    emit("letter_input", copy)
  },
  input_focus_suggestion(_, index) {
    if (index == this.index) this.el.focus()
  },
}
