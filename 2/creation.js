export class Being {
  emit(name, detail) {
    console.log(name, detail)
    document.dispatchEvent(new CustomEvent(name, { detail }))
  }
  on(name, f) {
    document.addEventListener(name, f)
  }
}
