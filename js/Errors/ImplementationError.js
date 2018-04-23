class ImplementationError extends Error {
  constructor(message, functionName) {
    super(message);
    this.functionName = functionName;
    this.name = this.constructor.name;
  }
}