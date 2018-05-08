const VehicleType = {
  CAR: { id: 1, capacity: 4, name: "Car" },
  BUS: { id: 2, capacity: 10, name: "Bus" },
  AMBULANCE: { id: 3, capacity: 1, name: "Ambulance" }
};

class Vehicle extends GameInterface {

  constructor(vehicleGO) {
    super();

    /** @type {Integer} Id do veículo. */
    this.id = vehicleGO.id;

    /** @type {Passenger[]} Array contendo os passageiros atuais dentro do veículo. */     
    this.passengers = vehicleGO.passengers;

    /** @type {Integer} Inteiro que informa a quantidade máxima de passageiros que este veículo suporta. */
    this.passengersCapacity = vehicleGO.passengersCapacity;

    /** @type {City} Última cidade que o veículo passou */
    this.lastCity = vehicleGO.lastCity.IEObject;

    /** @type {City[]} Array de cidades contendo a rota de destino deste veículo. */
    this.currentRoute = [];

    /** @type {VehicleType} */
    this.type = vehicleGO.type;

    /**
     * @private {VehicleGO}
     */
    this.__gameObject__ = vehicleGO;
  }

  /** @param {City|City[]|String|String[]} targetCity Mover o veículo para uma cidade ou para várias cidades, através de uma rota. */
  moveTo(targetCity) {
    let ok = false;
    if (targetCity) {
      if (typeof targetCity === "string") {
        ok = this.__gameObject__.moveToCityById(targetCity);
      } else if (targetCity && targetCity.constructor === Array) {
        if (typeof targetCity[0] === "string") {
          ok = this.__gameObject__.moveToCityById(targetCity);
        } else {
          let cityIds = targetCity.map((city) => {
            return city.id;
          });
          if (cityIds.length != 0)
            this.__gameObject__.moveToCityById(cityIds);
          else
            ok = false;
        }
      } else if (targetCity && targetCity.constructor === City) {
        ok = this.__gameObject__.moveToCityById(targetCity.id);
      }
    }

    if (!targetCity || !ok)
      Game.Instance().log.error(new CommandError(`${this} recieved an invalid city on <b>moveTo</b>: '${targetCity}'`));
  }

  /** @param {Passenger|Passenger[]} */
  load(passenger) {
    this.__gameObject__.addPassenger(passenger);
  }

  /** @param {Passenger} */
  unload(passenger) {
    this.__gameObject__.removePassenger(passenger);
  }
}