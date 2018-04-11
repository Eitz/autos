class Vehicle {

  constructor(_vehicleGO) {
    this._vehicleGO = _vehicleGO;
    /** @type {Passenger[]} Array contendo os passageiros atuais dentro do veículo. */     
    this.passengers = [];

    /** @type {Integer} Inteiro que informa a quantidade máxima de passageiros que este veículo suporta. */
    this.vehicleCapacity = this._vehicleGO.vehicleCapacity;

    /** @type {City} Última cidade que o veículo passou */
    this.lastCity = undefined;

    /** @type {City[]} Array de cidades contendo a rota de destino deste veículo. */
    this.currentRoute = [];
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

  /** @param {Passenger} */
  load(passenger) {
    
  }

  /** @param {Passenger} */
  unload(passenger) {
    
  }

  on(eventName, fn) {
    this._vehicleGO.on(eventName, fn);
  }
}