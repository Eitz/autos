class GameStats {
  constructor(domElement) {
    this.el = domElement;
    this.passengersDelivered = 0;
    this.elapsedTimeMS = 0;
    this.elapsedTimeSeconds = 0;
    this.updateInterface();
  }

  addPassenger() {
    this.passengersDelivered++;
    this.updateInterface();
  }

  getElapsedTime() {
    return parseInt(this.elapsedTimeMS / 1000);
  }

  updateInterface() {
    document.getElementById('passengers-delivered-count').innerHTML = this.passengersDelivered;
    document.getElementById('time-count').innerHTML = this.elapsedTimeSeconds;
  }

  addTime(ms) {
    this.elapsedTimeMS += ms;
    let seconds = this.getElapsedTime();
    if (seconds != this.elapsedTimeSeconds) {
      this.elapsedTimeSeconds = seconds;
      this.updateInterface();      
    }
  }
}