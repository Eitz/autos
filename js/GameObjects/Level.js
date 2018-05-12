class Level extends GameObject {

  constructor(levelName) {
    super(levelName);
    this.levelName = levelName;
    this.levelURL = `levels/${this.levelName}.json`
    /** @type {CityGO[]} */
    this.cities = [];
    /** @type {VehicleGO[]} */
    this.cars = [];
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
    this.setProperties({
      name: this.levelProps.name,
      description: this.levelProps.description,
      codeSample: this.levelProps.codeSample,
      shortDocumentation: this.levelProps.shortDocumentation,
      cities: CityGO.fromObject(this.levelProps.cities),
      cars: VehicleGO.fromObject(this.levelProps.cars),
      roads: RoadGO.fromObject(this.levelProps.roads),
      passengers: PassengerGO.fromObject(this.levelProps.passengers)
    });
  }

  setProperties(props) {
    for (let prop in props) {
      this[prop] = props[prop];
    }
  }
}