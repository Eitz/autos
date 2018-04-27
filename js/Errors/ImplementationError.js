class ImplementationError extends Error {
  constructor(err, functionName, lineNumber, columnNumber) {
    let introduction = functionName ? `in function ${functionName}` : "";
    super(`${introduction} (line: ${lineNumber}, column: ${columnNumber}) -> ${err}`);
    this.functionName = functionName;
    this.name = this.constructor.name;
  }
}