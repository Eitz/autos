class GameInterface {

  on(eventName, fn) {
    this.gameObject.on(eventName, fn);
  }

  toString() {
    return `{${this.constructor.name}#${this.id}}`;
  }
}