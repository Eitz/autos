class Road extends GameInterface {

  constructor(roadGO) {
    super();

    /** @type {string} Id da via. */
    this.id = roadGO.id;

    /** @type {City} Cidade de onde esta rua parte. */     
    this.from = roadGO.from.IEObject;

    /** @type {City} Cidade para onde esta rua segue. */
    this.to = roadGO.to.IEObject;

    /** @type {Integer} Tempo necessário para cruzar esta rua com um veículo padrão. */
    this.travelTime = roadGO.travelTime;

    /**
     * @private {RoadGO}
     */
    this.gameObject = roadGO;
  } 

  
}