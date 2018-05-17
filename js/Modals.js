class Modals {

  static showEndModal() {
    document.getElementById('modal-end').style.display = 'block';
    Modals.show();
  }

  static showDefeat(description) {
    document.getElementById('modal-defeat').style.display = 'block';
    document.getElementById('modal-description-defeat').innerHTML = description;
    Modals.show();
  }

  static showVictory(description) {
    document.getElementById('modal-victory').style.display = 'block';
    document.getElementById('modal-description-victory').innerHTML = description;
    Modals.show();
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