/**
 * The Game class provides some helper functions that the player can use to his/her advantage while playing the game and building paths.
 * 
 * This class also provides a reference to the log class.
 * 
 * This class also contains the stats of the game (how much time has passed, how many passengers have been delivered).
 */
class Game {

  constructor(autos) {
    this.autos = autos;
  }

  /**
   * Use this method to get the {@link Road} that runs from {@link City|cityA} to {@link City|cityB}.
   * 
   * Returns <code class="language-js">undefined</code> if there's no {@link Road} between them.
   * 
   * @param {City} cityA The "from" city
   * @param {City} cityB The "to" city
   */
  GetRoadBetween(cityA, cityB) {
    let roads = cityA.roads;
    for (let r of roads) {
      if (r.to == cityB) {
        return r;
      }
    }
    return undefined;
  }

  /**
   * This is a shortcut to get the time to travel between two {@link City|cities}.
   * 
   * Use this method to get the travel time from the {@link Road} that runs from {@link City|cityA} to {@link City|cityB}.
   * 
   * This method returns <code class="language-js">Infinity</code> if there's no {@link Road} from {@link City|cityA} to {@link City|cityB}.
   * 
   * @param {City} cityA The "from" city
   * @param {City} cityB The "to" city
   */
  GetTimeBetween(cityA, cityB) {
    let road = this.GetRoadBetween(cityA, cityB);
    if (road) {
      return road.travelTime;
    } else {
      return Infinity;
    }
  }

  /**
   * Use this method to get a {@link City} instance by its ID ("A" to "Z").
   * 
   * This method returns <code class="language-js">undefined</code> if there's no {@link City} with the specified ID.
   * 
   * @param {string} id - City's id.
   */
  GetCity(id) {
    return this.GetObjectById("City", id);
  }

  /** @private */
  GetObjectById(typeOfObject, id) {
    let go = this.autos.controller.getGameObjectByTypeAndId(typeOfObject, id);
    if (go)
      return go.IEObject;
  }

  /**
   * Use this property to get a reference to the console (at the bottom of the screen) and to write to it. View the below example for use cases.
   * 
   * @example <caption>You have to specify a logging level to write, as exemplified below </caption>
   * 
   * game.log.error("This is a error message");
   * game.log.debug("This is a debug message");
   * game.log.success("This is a success message");
   */
  get log () {
    return this.autos.log;
  }
  
  /**
   * Time the level has been running, in seconds.
   * @type {Integer}
   */
  get elapsedTimeSeconds() {
    return this.autos.gameStats.elapsedTimeSeconds;
  }

  /**
   * Time the level has been running, in ms.
   * @type {Integer}
   */
  get elapsedTimeMS() {
    return this.autos.gameStats.elapsedTimeMS;
  }

  /**
   * Quantity of passengers already delivered.
   * @type {Integer}
   */
  get passengersDelivered() {
    return this.autos.gameStats.passengersDelivered;
  } 
}