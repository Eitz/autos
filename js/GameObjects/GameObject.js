class GameObject {

  constructor() {
    this.renderOrder = 0;
    Game.Instance().controller.AddGameObject(this);
  }

  Start() {}
  
  Update(dt) {
    
  }  

  Render(ctx) {
    throw new Error("Render function must be implemented");
  }
}