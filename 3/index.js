import * as objects from "./objects.js"

const ctx = {
  emit(eventName, payload) {
    console.log(eventName, payload)
    for (const objectName of Object.getOwnPropertyNames(objects)) {
      const object = objects[objectName]
      for (const listener of Object.getOwnPropertyNames(object)) {
        if (listener === eventName) {
          object[listener](ctx, payload)
        }
      }
    }
  },
}

ctx.emit("epoch", document.body)
