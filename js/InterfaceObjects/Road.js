/**
 * This is Road!
 */
class Road extends GameInterface {

  constructor(roadGO) {
    super();

    /** @const {string} - ID da via (A-Z). */
    this.id = roadGO.id;

    /** @const {City} - Cidade de onde esta rua parte. */     
    this.from = roadGO.from.IEObject;

    /** @const {City} - Cidade para onde esta rua segue. */
    this.to = roadGO.to.IEObject;

    /** @const {Integer} - Tempo necessário para cruzar esta rua com um veículo padrão. */
    this.travelTime = roadGO.travelTime;

    /** @const {Integer} - */
    this.dampering = roadGO.dampering;

    /**
     * GameObject reference.
     * @type {RoadGO}
     * @private
     */
    this.__gameObject__ = roadGO;
  } 

  
}