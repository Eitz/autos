/**
 * This is City!
 */
class City extends GameInterface {

  constructor(cityGO) {
    super();

    /** 
     * Id da cidade.
     * @type {string}
     */
    this.id = cityGO.id;
    
    /**
     * Lista contendo os passageiros (Passenger) atuais esperando para serem transportados.
     * @type {Passenger[]}
     */     
    this.passengers = cityGO.passengers;

    /** 
     * Lista de ruas (Road) que fazem as ligações entre esta e as outras cidades.
     * @type {Road[]}
     */
    this.roads = cityGO.roads;

    /**
     * Lista de cidades que estão ligadas com esta cidade.
     * @type {City[]}
     */
    this.connectedCities = cityGO.connectedCities;

    /**
     * GameObject reference.
     * @type {CityGO}
     * @private
     */
    this.__gameObject__ = cityGO;
  }
}