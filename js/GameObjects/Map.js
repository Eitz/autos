class Map {
  constructor(mapName) {
    this.mapName = mapName;
    this.mapURL = `maps/${this.mapName}.xml`
  }

  create() {
    
  }

  getURL() {
    return this.mapURL;
  }

  fromXML(xml) {
    this.mapProps = Util.XMLtoJObject(xml);
    this.setProperties({
      name: this.mapProps.name,
      description: this.mapProps.description,
      codeSample: this.mapProps.codeSample,
      shortDocumentation: this.mapProps.shortDocumentation
    });
  }

  setProperties(props) {
    this.name = this.mapProps.name;
    this.description = this.mapProps.description;
    this.codeSample = this.mapProps.codeSample;
    this.shortDocumentation = this.mapProps.shortDocumentation;
  }
}