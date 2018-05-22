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
    this.renderOrder = 0;
    this.gameStats = Autos.Instance().gameStats;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx
   */
  Render(ctx) {
    let vCondition = "Win: " + this.conditions.victory.text;
    let dCondition = "Lose: " + this.conditions.defeat.text;

    this.RenderVictoryCondition(ctx, vCondition, new Vector2(15, 5));
    this.RenderDefeatCondition(ctx, dCondition, new Vector2(ctx.canvas.width, 5));
    
    if (this.levelProps.passengers.length)
      this.RenderPassengersDelivered(ctx, this.gameStats.passengersDelivered, new Vector2(15, ctx.canvas.height - 15));
    
    this.RenderCurrentTime(ctx, this.gameStats.elapsedTimeSeconds, new Vector2(ctx.canvas.width, ctx.canvas.height - 15));
  }

  RenderVictoryCondition(ctx, text, position) {
    let startingTextAlign = ctx.textAlign;
    
    ctx.fillStyle = '#393';
    ctx.fillRect(position.x, position.y, 10, 10);
    
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText(text, position.x + 15, position.y + 9);
    
    ctx.textAlign = startingTextAlign;
  }
  RenderDefeatCondition(ctx, text, position) {
    let startingTextAlign = ctx.textAlign;
    
    ctx.textAlign = 'right';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText(text, position.x, position.y+9);

    ctx.fillStyle = '#F66';
    let textWidth = ctx.measureText(text).width;
    ctx.fillRect(position.x - textWidth - 15, position.y, 10, 10);
    
    ctx.textAlign = startingTextAlign;    
  }

  RenderPassengersDelivered(ctx, text, position) {
    let startingTextAlign = ctx.textAlign;

    text = "Passengers delivered: " + text;
    
    ctx.fillStyle = '#FFF';
    ctx.fillRect(position.x, position.y, 10, 10);
    
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText(text, position.x + 15, position.y + 9);
    
    ctx.textAlign = startingTextAlign;
  }

  RenderCurrentTime(ctx, text, position) {

    if (text < 10)
      text = "0"+text;

    text = "Elapsed time: " + text + "s";

    let startingTextAlign = ctx.textAlign;
    
    ctx.textAlign = 'right';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText(text, position.x, position.y+9);

    ctx.fillStyle = '#000';
    let textWidth = ctx.measureText(text).width;
    ctx.fillRect(position.x - textWidth - 15, position.y, 10, 10);
    
    ctx.textAlign = startingTextAlign;    
  }

  Update(dt) {
    if (this.randomPassengers) {
      if (this.randomPassengers.nextSpawn === undefined) {
        this.randomPassengers.nextSpawn = 
          this.randomPassengers.delayMS +
          this.RandomIntFromInterval(
            -1 * this.randomPassengers.randomFactorMS,
            this.randomPassengers.randomFactorMS
          );
      }
      
      if (this.randomPassengers.nextSpawn < 0) {
        this.SpawnPassenger(this.randomPassengers.cities);
        this.randomPassengers.nextSpawn = undefined;
        return;
      }
      this.randomPassengers.nextSpawn -= dt;
    }
  }

  SpawnPassenger(fromCities) {
    if (!fromCities.length)
      fromCities = this.cities.filter(c => c.passengers.length < 4);
    let targetCities = this.cities;

    let from = Util.ShuffleArray(fromCities)[0];
    
    if (from) {  
      let to = Util.ShuffleArray(targetCities).filter(c => c != from)[0];
      PassengerGO.fromObject({
        from: from.id,
        to: to.id
      });
    }
  }

  RandomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  getURL() {
    return this.levelURL;
  }

  fromJSON(json) {
    this.levelProps = Util.JSONtoObject(json);
    this.SetProperties({
      name: this.levelProps.name,
      description: LinkWriter.Parse(this.levelProps.description),
      codeSample: this.levelProps.codeSample,
      helpText: LinkWriter.Parse('<li>' + this.levelProps.helpText.join('</li><li>') + '</li>'),
      cities: CityGO.fromObject(this.levelProps.cities),
      vehicles: VehicleGO.fromObject(this.levelProps.vehicles),
      roads: RoadGO.fromObject(this.levelProps.roads),
      passengers: PassengerGO.fromObject(this.levelProps.passengers),
      conditions: this.levelProps.conditions,
      randomPassengers: this.levelProps.randomPassengers
    });
    this.conditions.victory.function = Util.ParseFunction(this.levelProps.conditions.victory.function);
    this.conditions.defeat.function = Util.ParseFunction(this.levelProps.conditions.defeat.function);

    if (this.levelProps.randomCityIds) {
      Autos.Instance().controller.showCityIds = false
      this.RandomCityIds();
    } else {
      Autos.Instance().controller.showCityIds = true
    }
  }

  RandomCityIds() {
    let generator = Autos.Instance().idGenerator;
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