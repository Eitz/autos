class Level extends GameObject {

  constructor(levelName) {
    super(levelName);
    this.levelName = levelName;
    this.levelURL = `levels/${this.levelName}.json`
    /** @type {CityGO[]} */
    this.cities = [];
    /** @type {VehicleGO[]} */
    this.vehicles = [];
    /** @type {RoadGO[]} */
    this.roads = [];
    /** @type {PassengerGO[]} */
    this.passengers = [];
  }

  Render(ctx) {
    
  }

  getURL() {
    return this.levelURL;
  }

  fromJSON(json) {
    this.levelProps = Util.JSONtoObject(json);
    this.SetProperties({
      name: this.levelProps.name,
      description: this.levelProps.description,
      codeSample: this.levelProps.codeSample,
      shortDocumentation: this.levelProps.shortDocumentation,
      cities: CityGO.fromObject(this.levelProps.cities),
      vehicles: VehicleGO.fromObject(this.levelProps.vehicles),
      roads: RoadGO.fromObject(this.levelProps.roads),
      passengers: PassengerGO.fromObject(this.levelProps.passengers),
      conditions: this.levelProps.conditions
    });
    this.conditions.victory.function = Util.ParseFunction(this.levelProps.conditions.victory.function);
    this.conditions.defeat.function = Util.ParseFunction(this.levelProps.conditions.defeat.function);

    if (this.levelProps.randomCityIds) {
      Game.Instance().controller.showCityIds = false
      this.RandomCityIds();
    } else {
      Game.Instance().controller.showCityIds = true
    }
  }

  RandomCityIds() {
    let generator = Game.Instance().idGenerator;
    for (let city of Util.ShuffleArray(this.cities)) {
      let originalId = city.id;
      let newId = generator.GetNext('city');
      
      city.id = newId;
      city.IEObject.id = city.id;
      city.__oldid__ = originalId;
    }
  }

  SetProperties(props) {
    for (let prop in props) {
      this[prop] = props[prop];
    }
  }
}