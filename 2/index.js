import { Being } from "./creation.js"
import * as beings from "./beings.js"

Object.values(beings).map((Being_) => new Being_())

Being.prototype.on("game element", ({ detail: element }) =>
  document.body.appendChild(element)
)

Being.prototype.emit("begin")
