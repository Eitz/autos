class GameStats {
  constructor() {
    this.passengersDelivered = 0;
    this.elapsedTimeMS = 0;
  }

  addPassenger() {
    this.passengersDelivered++;
  }

  getElapsedTime() {
    return parseInt(this.elapsedTimeMS / 1000);
  }

  addTime(ms) {
    this.elapsedTimeMS += ms;
  }
}