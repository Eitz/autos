class IDGenerator {
  constructor() {
    this.generators = {};
  }

  GetNext(name) {
    if (!this.generators[name]) {
      this.generators[name] = 'A';
      return this.generators[name];
    }

    if (this.generators[name].slice(-1) == 'Z') {
      this.generators[name] += 'A';
      return this.generators[name];
    }

    let characters = this.generators[name].split('');
    let code = characters[characters.length-1].charCodeAt(0);
    characters[characters.length-1] = String.fromCharCode(code+1);
    console.log(String.fromCharCode(code+1));
    this.generators[name] = characters.join('');
    
    return this.generators[name];
  }
}