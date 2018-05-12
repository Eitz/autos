class GameFunctions {

  constructor(game) {
    this.game = game;
  }

  GetTimeBetween(cityA, cityB) {
    let roads = cityA.roads;
    for (let r of roads) {
      if (r.to == cityB) {
        return r.__gameObject__.GetTravelTime(this.game.vehicleVelocity);
      }
    }
    return Infinity;
  }

  GetObjectById(typeOfObject, id) {
    let go = this.game.controller.getGameObjectByTypeAndId(typeOfObject, id);
    if (go)
      return go.IEObject;
  }
}