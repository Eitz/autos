/**
 * Every city on the map is an instance of the City class. Cities may contain {@link Passenger}s and {@link Vehicle}s.
 * 
 * @hideconstructor
 *
 * @example <caption>Example of setting up an event handler that is triggered whenever a city gets a new {@link Passenger}.</caption>
 * function init (vehicles, cities, passengers, game) {
 *
 *    let city = city[0];
 * 
 *    city.on('newPassenger', function(passenger) {
 *      // perhaps move a vehicle here??
 *    });
 * } 
 */
class City extends GameInterface {

  constructor(cityGO) {
    super();

    /** 
     * City's id (may be between "A" and "Z").
     * @const
     * @type {string}
     */
    this.id = cityGO.id;
    
    /**
     * List of {@link Passenger}s currently waiting to be delivered.
     * @type {Passenger[]}
     */     
    this.passengers = cityGO.passengers;

    /** 
     * List of {@link Road}s that run from this city to other cities.
     * @const
     * @type {Road[]}
     */
    this.roads = cityGO.roads;

    /**
     * List of cities that this city connects to by its {@link Road}s
     * @const
     * @type {City[]}
     */
    this.connectedCities = cityGO.connectedCities;

    /**
     * GameObject reference.
     * @type {CityGO}
     * @private
     */
    this.__gameObject__ = cityGO;
  }
}

 /**
 * Event that is triggered whenever this city gets a new {@link Passenger}. It's **not** triggered when a car delivers a passenger.
 * @memberof City
 * @event City.on:newPassenger
 * @param {('newPassenger')} name Name of this event
 * @param {Function} onNewPassenger - Function that is called when this this city gets a new {@link Passenger}, receives as argument the {@link Passenger}.
 * @example
 * function init (vehicles, cities, passengers, game) {
 *    let city = cities[0];
 *    city.on('newPassenger', function(passenger) {
 *      // do something?
 *    });
 * }
 */