class Vehicle extends GameInterface {

  constructor(vehicleGO) {
    super();

    /** @type {Integer} Id do veículo. */
    this.id = vehicleGO.id;

    /** @type {Passenger[]} Array contendo os passageiros atuais dentro do veículo. */     
    this.passengers = vehicleGO.passengers;

    /** @type {Integer} Inteiro que informa a quantidade máxima de passageiros que este veículo suporta. */
    this.vehicleCapacity = vehicleGO.vehicleCapacity;

    /** @type {City} Última cidade que o veículo passou */
    this.lastCity = vehicleGO.lastCity.IEObject;

    /** @type {City[]} Array de cidades contendo a rota de destino deste veículo. */
    this.currentRoute = [];

    /**
     * @private {VehicleGO}
     */
    this.gameObject = vehicleGO;
  }

  /** @param {City|City[]|String|String[]} targetCity Mover o veículo para uma cidade ou para várias cidades, através de uma rota. */
  moveTo(targetCity) {
    let ok = false;
    if (targetCity) {
      if (typeof targetCity === "string") {
        ok = this.gameObject.moveToCityById(targetCity);
      } else if (targetCity && targetCity.constructor === Array) {
        if (typeof targetCity[0] === "string") {
          ok = this.gameObject.moveToCityById(targetCity);
        } else {
          let cityIds = targetCity.map((city) => {
            return city.id;
          });
          if (cityIds.length != 0)
            this.gameObject.moveToCityById(cityIds);
          else
            ok = false;
        }
      } else if (targetCity && targetCity.constructor === City) {
        ok = this.gameObject.moveToCityById(targetCity.id);
      }
    }

    if (!targetCity || !ok)
      Game.Instance().log.error(new CommandError(`${this} recieved an invalid city on <b>moveTo</b>: '${targetCity}'`));
  }

  /** @param {Passenger|Passenger[]} */
  load(passenger) {
    this.gameObject.addPassenger(passenger);
  }

  /** @param {Passenger} */
  unload(passenger) {
    this.gameObject.removePassenger(passenger);
  }
}