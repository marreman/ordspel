import * as classes from "./classes.js"

// const ctx = new Context()

Object.values(classes).forEach((c) => ctx.create(c))

ctx.emit("epoch", document.body)
