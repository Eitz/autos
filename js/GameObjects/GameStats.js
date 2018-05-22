class GameStats {
  constructor(domElement) {
    this.el = domElement;
    this.passengersDelivered = 0;
    this.elapsedTimeMS = 0;
    this.elapsedTimeSeconds = 0;
  }

  addPassenger() {
    this.passengersDelivered++;
  }

  getElapsedTimeInSeconds() {
    return parseInt(this.elapsedTimeMS / 1000);
  }

  addTime(ms) {
    this.elapsedTimeMS += ms;
    let seconds = this.getElapsedTimeInSeconds();
    if (seconds != this.elapsedTimeSeconds) {
      this.elapsedTimeSeconds = seconds;
    }
  }
}