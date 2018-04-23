class Passenger {

  constructor(passengerGO) {
    /** @type {string} Id do passageiro. */
    this.id = passengerGO.id;

    /** @type {string} Nome fantasia do passageiro. */     
    this.name = passengerGO.name;
    
    /** @type {City} Última cidade que este passageiro esteve. */
    this.lastCity = passengerGO.lastCity.cityIE;

    /** @type {City} Cidade que este passageiro se originou. */
    this.fromCity = passengerGO.fromCity.cityIE;

    /** @type {City} Cidade que este passageiro tem como destino. */
    this.toCity = passengerGO.toCity.cityIE;

    /**
     * @private {PassengerGO}
     */
    this._passengerGO = passengerGO;
  }

  /** @type {Integer} Tempo que este passageiro já esteve esperando um veículo, em segundos. Só conta enquanto o passageiro estiver fora de um veículo. */
  get waitingTime() {
    return parseInt(this._passengerGO.getWaitingTimeInSeconds());
  }
}