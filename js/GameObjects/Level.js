class Level extends GameObject {

  constructor(levelName) {
    super(levelName);
    this.levelName = levelName;
    this.levelURL = `levels/${this.levelName}.json`
    /** @type {City[]} */
    this.cities = [];
    /** @type {Car[]} */
    this.cars = [];
    /** @type {Road[]} */
    this.roads = [];
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
      cities: City.fromObject(this.levelProps.cities),
      cars: Car.fromObject(this.levelProps.cars),
      roads: Road.fromObject(this.levelProps.roads)
    });
  }

  setProperties(props) {
    for (let prop in props) {
      this[prop] = props[prop];
    }
  }
}