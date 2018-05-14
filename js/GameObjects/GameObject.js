class GameObject extends GameEventManager {

  constructor() {
    super();
    this.renderOrder = 0;
    /** @type {Object.<string, GameEvent>} */
    this.events = {};

    Game.Instance().controller.AddGameObject(this);    
  }

  Prepare() {}

  Start() {}
  
  Update(dt) {}

  Render(ctx) {
    throw new Error("Render function must be implemented");
  }
}