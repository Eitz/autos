class GameEvent {
  constructor(name) {
    this.name = name;
    this.listeners = [];
  }

  execute(params) {
    for(let cb of this.listeners) {
      try {
        cb.apply(this, params);
      } catch (err) {
        let game = Game.Instance();
        game.Stop();
        let numbers = Util.GetErrorNumbers(err.stack);
			  err = new ImplementationError(err, `for event: '${this.name}'`, numbers.line, numbers.column);
        game.log.error(err);
        Modals.showError(err.toString());
      }
    }
  }

  addEventListener(callback) {
    this.listeners.push(callback);
  }

  hasListeners() {
    return !!this.listeners.length;
  }
}