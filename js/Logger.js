class Logger {

  constructor(logElement) {
    this.el = logElement;
    this.count = 1;
  }

  /**
   * @param {Error|string} text 
   */
  debug(text) {
    this.el.insertAdjacentHTML('beforeend', this.getLogHTML('debug', text));
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
    this.el.insertAdjacentHTML('beforeend', this.getLogHTML('error', text));
  }
  getLogHTML(status, text) {
    text = '[' + status  + '] ' + text;
    return '<div class="log' + (status ? ' log-' + status : '') +'">' + text + '</div>';
  }
}

