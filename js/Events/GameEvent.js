class GameEvent {
  constructor() {
    this.listeners = [];
  }

  execute(params) {
    for(let cb of this.listeners) {
      cb.apply(this, params);
    }
  }

  addEventListener(callback) {
    this.listeners.push(callback);
  }

  hasListeners() {
    return !!this.listeners.length;
  }
}