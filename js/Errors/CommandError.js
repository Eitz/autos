class CommandError extends Error {
  constructor(message, command, target) {
    super(message);
    this.message = message;
    this.command = command;
    this.target = target;
    this.name = this.constructor.name;
  }
}