class Passenger extends GameInterface {

  constructor(passengerGO) {
    super();

    /** @type {string} Id do passageiro. */
    this.id = passengerGO.id;

    /** @type {string} Nome fantasia do passageiro. */     
    this.name = passengerGO.name;
    
    /** @type {City} Última cidade que este passageiro esteve. */
    this.lastCity = passengerGO.lastCity.IEObject;

    /** @type {City} Cidade que este passageiro se originou. */
    this.fromCity = passengerGO.fromCity.IEObject;

    /** @type {City} Cidade que este passageiro tem como destino. */
    this.toCity = passengerGO.toCity.IEObject;

    /**
     * @private {PassengerGO}
     */
    this.__gameObject__ = passengerGO;
  }

  /** @type {Integer} Tempo que este passageiro já esteve esperando um veículo, em segundos. Só conta enquanto o passageiro estiver fora de um veículo. */
  get waitingTime() {
    return parseInt(this.__gameObject__.getWaitingTimeInSeconds());
  }
}