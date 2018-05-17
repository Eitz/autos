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

  static ShuffleArray(d) {
    for (var c = d.length - 1; c > 0; c--) {
      var b = Math.floor(Math.random() * (c + 1));
      var a = d[c];
      d[c] = d[b];
      d[b] = a;
    }
    return d;
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