class Util {
  
  static JSONtoObject(jsonText) {
    return JSON.parse(jsonText);
  }

  static ParseFunction(json) {
    let code;
		try {
      code = new Function('{ try { return ' + json + ' } catch (err) { throw err; }}');
      code = code();
		} catch(err) {
			console.error(err);
			return;
		}
		return code;
  }

  static GetErrorNumbers(stackTrace) {
    let regex = /<anonymous>:(\d+):(\d+)/;
    let matches = regex.exec(stackTrace);
    // FF
    if (!matches) {
      regex = /Function:(\d+):(\d+)/;
      matches = regex.exec(stackTrace);
    }    
    matches[1]-=2;
    return { line: matches[1], column: matches[2] };
  }
}