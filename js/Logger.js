class Logger {

  constructor(logElement) {
    this.el = logElement;
    if (this.el.innerHTML) {
      this.el.innerHTML = "";
      this.debug("The game has been reset");
    }
  }

  /**
   * @param {Error|string} text 
   */
  debug(text) {
    this.el.insertAdjacentHTML('beforeend', this.getLogHTML(' debug ', text));
  }

  /**
   * @param {Error|string} text 
   */
  warning(text) {
    this.el.insertAdjacentHTML('beforeend', this.getLogHTML('warning', text));
  }

  /**
   * @param {string} text 
   */
  success(text) {
    this.el.insertAdjacentHTML('beforeend', this.getLogHTML('success', text));
  }

  /**
   * @param {Error|string} text 
   */
  error(text) {
    console.error(text);
    this.el.insertAdjacentHTML('beforeend', this.getLogHTML(' error ', text));
  }

  getLogHTML(status, text) {
    if (text instanceof Array) {
      text = `[${text.toString()}]`;
    }
    text = '[' + status  + '] ' + LinkWriter.Parse(text.toString());
    return '<div class="log' + (status ? ' log-' + status.trim() : '') +'">' + text + '</div>';
  }
}

