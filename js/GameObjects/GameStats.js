class GameStats {
  constructor(domElement) {
    this.el = domElement;
    this.passengersDelivered = 0;
    this.elapsedTimeMS = 0;
    this.elapsedTimeSeconds = 0;
  }

  addPassenger() {
    this.passengersDelivered++;
    this.updateInterface();
  }

  getElapsedTime() {
    return parseInt(this.elapsedTimeMS / 1000);
  }

  updateInterface() {
    
  }

  addTime(ms) {
    this.elapsedTimeMS += ms;
    let seconds = this.getElapsedTime();
    if (seconds != this.elapsedTimeSeconds) {
      this.updateInterface();
      this.elapsedTimeSeconds = secods;
    }
  }
}