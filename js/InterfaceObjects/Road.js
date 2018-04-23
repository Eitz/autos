class Road {
  constructor(roadGO) {
    /** @type {string} Id da via. */
    this.id = roadGO.id;

    /** @type {City} Cidade de onde esta rua parte. */     
    this.from = roadGO.from.cityIE;

    /** @type {City} Cidade para onde esta rua segue. */
    this.to = roadGO.to.cityIE;

    /** @type {Integer} Tempo necessário para cruzar esta rua com um veículo padrão. */
    this.travelTime = roadGO.travelTime;

    /**
     * @private {RoadGO}
     */
    this._roadGO = roadGO;
  } 

  
}