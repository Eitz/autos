class GameEventManager {
  
  constructor() {
    /** @type {Object.<string, GameEvent>} */
    this.events = {};
  }
  
  on(eventName, callback) {
    if (!this.eventExists(eventName)) {
      this.createNewEvent(eventName);
    }
    this.events[eventName].addEventListener(callback);
  }

  trigger(eventName, args) {
    if (this.eventExists(eventName)) {
      this.events[eventName].execute(args);
    }
  }

  eventExists(eventName) {
    return this.events[eventName] && this.events[eventName].hasListeners();
  }

  createNewEvent(eventName) {
    let event = new GameEvent(eventName);
    this.events[eventName] = event;
  }

}