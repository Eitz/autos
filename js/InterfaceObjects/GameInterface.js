/**
 * @global
 * @function init
 * @param {Vehicle[]} vehicles List of {@link Vehicle}s that are in this level.
 * @param {City[]} cities List of {@link City}s that are in this level.
 * @param {Passenger[]} passengers List of {@link Passenger}s that are in this level.
 * @param {Game} game Helper class that provides helpful methods and properties.
 * @description This functions gets executed automaticaly when the player presses the "Start" button.
 * @example
 * function init (vehicles, cities, passengers, game) {
 *	let v = vehicles[0];
 * 
 * }
 */

 /**
 * @global
 * @function update
 * @param {Vehicle[]} vehicles List of {@link Vehicle}s that are in this level.
 * @param {City[]} cities List of {@link City}s that are in this level.
 * @param {Passenger[]} passengers List of {@link Passenger}s that are in this level.
 * @param {Game} game Helper class that provides helpful methods and properties.
 * @description This function gets executed every frame. Not generally used, but it exists.
 * @example
 * function update (vehicles, cities, passengers, game) {
 *	let v = vehicles[0];
 * 
 * }
 */


class GameInterface {

  on(eventName, fn) {
    this.__gameObject__.on(eventName, fn);
  }

  toString() {
    return `{<c>${this.constructor.name}</c>#${this.id}}`;
  }
}