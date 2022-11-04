export class Context {
  objects = []

  emit(eventName, payload) {
    console.log("emit", ...arguments)
    for (const object of this.objects)
      if (typeof object[eventName] === "function")
        object[eventName](this, payload)
  }

  create(Class, ...args) {
    console.log("create", ...arguments)
    this.objects.push(new Class(this, ...args))
  }
}
