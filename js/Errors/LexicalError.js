class LexicalError extends Error {
  constructor(message, line, collumn) {
    super(message);
    this.message = message;
    this.line = line;
    this.collumn = collumn;
    this.name = this.constructor.name;
  }
}