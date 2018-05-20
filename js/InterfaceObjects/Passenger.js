/**
 * Every passenger on the map is an instance of the Passenger class.
 * 
 * Passengers want to get from their initi {@link City} to their destination city, your task is to help them using your {@link Vehicle}s.
 * 
 * @hideconstructor
 *
 * @example <caption>Example of {@link Vehicle} taking a passenger and delivering him to his desired {@link City}</caption>
 * function init (vehicles, cities, passengers, game, stats) {
 *    
 *    // assuming they are in the same city
 *    let vehicle = vehicle[0];
 *    let passenger = passengers[0];
 *    
 *    // assuming the cities are adjacent
 *    vehicle.moveTo(passenger.toCity);
 *  
 *    vehicle.on('visitCity', function(city) {
 *      if (city === passenger.toCity)
 *        vehicle.unload(passenger);
 *    });
 * } 
 */
class Passenger extends GameInterface {

  constructor(passengerGO) {
    super();

    /**
     * Passenger's id (may be between "A" and "Z").
     * @type {string}
     */
    this.id = passengerGO.id;

    /**
     * The last {@link City} this passenger has been in.
     * @type {City}
     */
    this.lastCity = passengerGO.lastCity.IEObject;

    /**
     * The {@link City} this passenger is from.
     * @type {City}
     */
    this.fromCity = passengerGO.fromCity.IEObject;

    /**
     * The {@link City} this passenger desires to go to.
     * @type {City}
     */
    this.toCity = passengerGO.toCity.IEObject;

    /**
     * Current {@link Vehicle} that this passenger is in. It is <code class="language-js">undefined</code> if the passenger is not in a vehicle.
     * @type {Vehicle}
     */
    this.onBoard = passengerGO.onBoard;

    /**
    * GameObject reference.
    * @type {PassengerGO}
    * @private
    */
    this.__gameObject__ = passengerGO;
  }

  /**
   * The time that this passengers has been waiting to be delivered.
   * @type {Integer}
   */
  get waitingTime() {
    return parseInt(this.__gameObject__.getWaitingTimeInSeconds());
  }
}