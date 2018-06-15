/**
 * @typedef {VehicleType} - Global ENUM that is used to represent each {@link Vehicle}'s type.
 * @property {object} CAR - Default vehicle type
 * @property {Integer} CAR.id - Type's id (1)
 * @property {Integer} CAR.capacity - Type's capacity for passengers (4)
 * @property {string} CAR.name - Type's name ("Car")
 * @property {object} BUS - Advanced vehicle type
 * @property {Integer} BUS.id - Type's id (2)
 * @property {Integer} BUS.capacity - Type's capacity for passengers (10)
 * @property {string} BUS.name - Type's name ("Bus")
 * @example
 * const VehicleType = {
 *  CAR: { id: 1, capacity: 4, name: "Car" },
 *  BUS: { id: 2, capacity: 10, name: "Bus" },
*  };
 */
const VehicleType = {
  CAR: { id: 1, capacity: 4, name: "Car", size: { x: 12, y: 10 }, color: "#2d2006" },
  BUS: { id: 2, capacity: 10, name: "Bus", size: { x: 18, y: 12 }, color: "green" },
};

/**
 * The Vehicle class represents a vehicle within the game. Every vehicle in the game is an instance of this class. The Vehicle's task is to transport passengers to their desided destinations.
 *  
 * Vehicles can travel between {@link City|Cities} when these cities are connected by {@link Road|Roads}.
 * 
 * Vehicles are able to carry {@link Passenger|Passengers} up to a max capacity, which depends on their {@link VehicleType|type}.
 * 
 * @hideconstructor
 *
 * @example <caption>Example of a vehicle going back and forth between cities A, B and C</caption>
 * function init (vehicles, cities, passengers, game) {
 *
 *    let vehicle = vehicles[0];
 *    vehicle.moveTo(['B', 'C']);
 * 
 *    vehicle.on('visitCity', function(city) {
 *      if (city.id == 'C')
 *        vehicle.moveTo(['B', 'A']);
 *      else if (city.id == 'C')
 *        vehicle.moveTo(['B', 'A']);
 *    });
 * } 
 */
class Vehicle extends GameInterface {

  /** @private */
  constructor(vehicleGO) {
    super();

    /**
     * The vehicle's id. It is a letter between "A" and "Z".
     * @readonly
     * @const {String}
     */
    this.id = vehicleGO.id;

     /**
      * Contains the information about this type of vehicle: capacity and type name.
      * @const {VehicleType}
      * @example
      * game.log.debug(vehicle.type.name); // outputs "car" or "bus"
      * game.log.debug(vehicle.type.capacity); // outputs 4 or 10
      */
    this.type = vehicleGO.type;

    /**
     * Integer that informs how many {@link Passenger|Passengers} can fit inside this vehicle based on this {@link VehicleType}. Basically a shortcut to <code class="language-js">Vehicle.type.capacity</code>.
     * @const {Integer}
     */
    this.passengersCapacity = vehicleGO.passengerCapacity;

    /**
     * List of {@link Passenger}s that are currently inside this vehicle.
     * @type {Passenger[]}
     */
    this.passengers = vehicleGO.passengers;

    /**
     * The last {@link City} that this vehicle has been through.
     * @type {City}
     */
    this.lastCity = vehicleGO.lastCity.IEObject;

    /**
     * Current {@link City} that this vehicle is in. This property is <code class="language-js">undefined</code> if the vehicle is travelling over {@link Road}s.
     * @type {City}
     */
    this.currentCity = vehicleGO.currentCity;

    /**
     * Destination route of this vehicle, a list of {@link City|cities}. Each call of {@link Vehicle#moveTo|moveTo(city)} adds a city to the end of this list. The city is only removed when the vehicle reaches it.
     * @type {City[]}
     */
    this.currentRoute = [];

    /**
    * GameObject reference.
    * @type {VehicleGO}
    * @private
    */
    this.__gameObject__ = vehicleGO;
  }

  /**
   * Method responsable for setting the destination of this vehicle. If the vehicle already has planned moves, the argument City is appended to this vehicle's {@link Vehicle#currentRoute|current route}. This method can receive both instances of {@link City} or only their IDs.
   * @param {City|City[]|String|String[]} targetCity Instance(s) of {@link City} or only their ID(s).
   * @example
   * // using a City instance
   * vehicle.moveTo(city);
   * // or by using only id
   * vehicle.moveTo('C');
   */
  moveTo(targetCity) {
    let ok = true;
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
      Autos.Instance().log.error(new CommandError(`${this} recieved an invalid city on <m c="Vehicle">moveTo</m>: '${targetCity}'`));
  }

  /**
   * Load a {@link Passenger} or a list of them to the vehicle. They must be in the same {@link City} as the vehicle.
   * @param {Passenger|Passenger[]} passengers - Passenger(s) to load
   * */
  load(passengers) {
    if (passengers && passengers instanceof Array) {
      for (let p of [...passengers]) {
        this.__gameObject__.addPassenger(p);
      }
    } else {
      this.__gameObject__.addPassenger(passengers);
    }
  }

  /**
   * Unloads a {@link Passenger} or a list of them to the vehicle's {@link Vehicle#currentCity|current city}. They vehicle must be visiting the city to be able to drop passengers.
   * @param {Passenger|Passenger[]} passengers - Passenger(s) to unload
   * */
  unload(passengers) {
    if (!passengers) {
      passengers = this.passengers;
    }
    if (this.currentCity) {
      if (passengers && passengers instanceof Array && passengers.length > 0) {
        for (let p of passengers) {
          if (p.onBoard == this) {
            this.__gameObject__.removePassenger(p);
          } else {
            Autos.Instance().log.error(new CommandError(`${this} can't unload a passenger that is not on the Vehicle: '${p}'`));
          }
        }
      } else if (passengers instanceof Passenger) {
        if (passengers.onBoard == this) {
          this.__gameObject__.removePassenger(passengers);
        } else {
          Autos.Instance().log.error(new CommandError(`${this} can't unload a passenger that is not on the Vehicle: '${passengers}'`));
        }
      } else {
        Autos.Instance().log.warning(new CommandError(`${this} can't unload an inexistent passenger on ${this.currentCity}`));
      }
    } else {
      Autos.Instance().log.error(new CommandError(`${this} can't unload a passengers on the road!: '${passengers}'`));
    }

  }
}

/**
 * Event that is triggered whenever this vehicle visits a city and stops moving for more than a second.
 * @memberof Vehicle
 * @event Vehicle.on:idle
 * @param {('idle')} name Name of this event
 * @param {Function} onIdle - Function that is called when this vehicle is idle for more then 1 second, receives the current {@link City} by param.
 * @example
 * function init (vehicles, cities, passengers, game) {
 *    let vehicle = vehicles[0];
 *    vehicle.on('idle', function(city) {
 *      vehicle.moveTo('A');
 *    });
 * }
 */

/**
 * Event that is triggered whenever this vehicle visits a city
 * @memberof Vehicle
 * @event Vehicle.on:visitCity
 * @param {('visitCity')} name Name of this event
 * @param {Function} onVisitCity - Function that is called when this vehicle visits a city, receives the visited {@link City} by param.
 * @example
 * function init (vehicles, cities, passengers, game) {
 *    let vehicle = vehicles[0];
 *    vehicle.on('visitCity', function(city) {
 *      if (city.id === 'A') {
 *        vehicle.moveTo('B');
 *      }
 *    });
 * }
 */

 /**
 * Event that is triggered whenever this vehicle loads a {@link Passenger}
 * @memberof Vehicle
 * @event Vehicle.on:loadPassenger
 * @param {('loadPassenger')} name Name of this event
 * @param {Function} onLoadPassenger - Function that is called when this vehicle loads a {@link Passenger}, receives the loaded {@link Passenger} and his {@link City} by param.
 * @example
 * function init (vehicles, cities, passengers, game) {
 *    let vehicle = vehicles[0];
 *    vehicle.on('loadPassenger', function(passenger, city) {
 *      // do something
 *    });
 * }
 */
// export default Vehicle;