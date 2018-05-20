/**
 * Every road on the map is an instance of the Road class.
 * 
 * Roads should be used to take your {@link Vehicle}s between cities. Roads may have weights, use them to your favor when delivering {@link Passenger}s.
 * 
 * @hideconstructor
 *
 */
class Road extends GameInterface {

  constructor(roadGO) {
    super();

     /** 
     * Road's id (may be between "A" and "Z").
     * @const
     * @type {string}
     */
    this.id = roadGO.id;

     /**
     * The {@link City} this Road starts from.
     * @const
     * @type {City}
     */
    this.from = roadGO.from.IEObject;

    /**
     * The {@link City} this Road leads to.
     * @const
     * @type {City}
     */
    this.to = roadGO.to.IEObject;

    /**
     * Necessary time to travel in this road. It's the same for all {@link Vehicle}s.
     * @const
     * @type {number}
     */
    this.travelTime = roadGO.travelTime;

    /**
     * How better or worse is this Road compared to other roads, some levels may use this to tweak the Road speed.
     * @const
     * @type {number}
     */
    this.dampering = roadGO.dampering;

    /**
     * GameObject reference.
     * @type {RoadGO}
     * @private
     */
    this.__gameObject__ = roadGO;
  } 

  
}