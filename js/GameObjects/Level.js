class Level {
  constructor(levelName) {
    this.levelName = levelName;
    this.levelURL = `levels/${this.levelName}.xml`
  }

  create() {
    
  }

  getURL() {
    return this.levelURL;
  }

  fromXML(xml) {
    this.levelProps = Util.XMLtoJObject(xml);
    this.setProperties({
      name: this.levelProps.name,
      description: this.levelProps.description,
      codeSample: this.levelProps.codeSample,
      shortDocumentation: this.levelProps.shortDocumentation
    });
  }

  setProperties(props) {
    this.name = this.levelProps.name;
    this.description = this.levelProps.description;
    this.codeSample = this.levelProps.codeSample;
    this.shortDocumentation = this.levelProps.shortDocumentation;
    console.log(this);
  }
}