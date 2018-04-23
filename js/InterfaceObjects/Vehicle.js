class Vehicle {

  constructor(vehicleGO) {
    /** @type {Passenger[]} Array contendo os passageiros atuais dentro do veículo. */     
    this.passengers = vehicleGO.passengers;

    /** @type {Integer} Inteiro que informa a quantidade máxima de passageiros que este veículo suporta. */
    this.vehicleCapacity = vehicleGO.vehicleCapacity;

    /** @type {City} Última cidade que o veículo passou */
    this.lastCity = vehicleGO.lastCity.cityIE;

    /** @type {City[]} Array de cidades contendo a rota de destino deste veículo. */
    this.currentRoute = [];

    /**
     * @private {VehicleGO}
     */
    this._vehicleGO = vehicleGO;
  }

  /** @param {City|City[]|String|String[]} targetCity Mover o veículo para uma cidade ou para várias cidades, através de uma rota. */
  moveTo(targetCity) {
    if (targetCity) {
      if (typeof targetCity === "string") {
        this._vehicleGO.moveToCityById(targetCity);
      } else if (targetCity && targetCity.constructor === Array) {
        if (typeof targetCity[0] === "string") {
          this._vehicleGO.moveToCityById(targetCity);
        } else {
          let cityIds = targetCity.map((city) => {
            return city.id;
          });
          this._vehicleGO.moveToCityById(cityIds);
        }
      }
    } else {
      // FIXME: "No city was informed"
    }    
  }

  /** @param {Passenger|Passenger[]} */
  load(passenger) {
    this._vehicleGO.addPassenger(passenger);
  }

  /** @param {Passenger} */
  unload(passenger) {
    this._vehicleGO.removePassenger(passenger);
  }

  on(eventName, fn) {
    this._vehicleGO.on(eventName, fn);
  }
}