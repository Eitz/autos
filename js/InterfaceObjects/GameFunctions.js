class GameFunctions {

  constructor(game) {
    this.game = game;
  }

  GetRoadBetween(cityA, cityB) {
    let roads = cityA.roads;
    for (let r of roads) {
      if (r.to == cityB) {
        return r;
      }
    }
    return undefined;
  }

  GetTimeBetween(cityA, cityB) {
    let road = this.GetRoadBetween(cityA, cityB);
    if (road) {
      return r.travelTime;
    } else {
      return Infinity;
    }
  }

  GetObjectById(typeOfObject, id) {
    let go = this.game.controller.getGameObjectByTypeAndId(typeOfObject, id);
    if (go)
      return go.IEObject;
  }
}