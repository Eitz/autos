class GameInterface {

  on(eventName, fn) {
    this.__gameObject__.on(eventName, fn);
  }

  toString() {
    return `{${this.constructor.name}#${this.id}}`;
  }
}