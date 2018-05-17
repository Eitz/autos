class City extends GameInterface {

  constructor(cityGO) {
    super();

    /** @type {string} Id da cidade. */
    this.id = cityGO.id;
    
    /** @type {Passenger[]} Lista contendo os passageiros (Passenger) atuais esperando para serem transportados. */     
    this.passengers = cityGO.passengers;

    /** @type {Road[]} Lista de ruas (Road) que fazem as ligações entre esta e as outras cidades. */
    this.roads = cityGO.roads;

    /** @type {City[]} Lista de cidades que estão ligadas com esta cidade. */
    this.connectedCities = cityGO.connectedCities;

    /**
     * @private {CityGO}
     */
    this.__gameObject__ = cityGO;
  }
}