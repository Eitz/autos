/**
 * This is Passenger!
 */
class Passenger extends GameInterface {

  constructor(passengerGO) {
    super();

    /**
     * Id do passageiro.
     * @type {string}
     */
    this.id = passengerGO.id;

    /**
     * Nome fantasia do passageiro.
     * @type {string}
     */
    this.name = passengerGO.name;
    
    /**
     * Última cidade que este passageiro esteve.
     * @type {City}
     */
    this.lastCity = passengerGO.lastCity.IEObject;

    /**
     * Cidade que este passageiro se originou.
     * @type {City}
     */
    this.fromCity = passengerGO.fromCity.IEObject;

    /**
     * Cidade que este passageiro tem como destino.
     * @type {City}
     */
    this.toCity = passengerGO.toCity.IEObject;

    /**
     * Veículo que este passageiro esta abordo.
     * @type {Vehicle}
     */
    this.onBoard = passengerGO.onBoard;

    /**
    * GameObject reference.
    * @type {PassengerGO}
    * @private
    */
    this.__gameObject__ = passengerGO;
  }

  /**
   * Tempo que este passageiro já esteve esperando um veículo, em segundos. Só conta enquanto o passageiro estiver fora de um veículo.
   * @type {Integer}
   */
  get waitingTime() {
    return parseInt(this.__gameObject__.getWaitingTimeInSeconds());
  }
}