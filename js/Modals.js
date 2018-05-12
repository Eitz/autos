class Modals {

  static showDescription() {

  }

  static showLose() {

  }

  static showVictory() {

  }

  static showError(errStr) {
    document.getElementById('modal-error').style.display = 'block';
    document.getElementById('error-line').innerHTML = errStr;
    Modals.show();
  }

  static show() {
    document.getElementsByTagName('body')[0].classList.add('modal-on');
  }

  static hide() {
    let modals = document.getElementsByClassName('modal');
    for (let m of modals) {
      m.style.display = 'none';
    }
    document.getElementsByTagName('body')[0].classList.remove('modal-on');
  }
}