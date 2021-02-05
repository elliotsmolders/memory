export default class Card {
  constructor(holder, icon) {
    this._holder = holder;
    this._icon = icon;
    this._flippedEvent = new CustomEvent("flipped", { detail: this });
    this._ref = this.init();
    this._isFlipped = false;
    this.setUpEvents();
  }
  init() {
    this._holder.insertAdjacentHTML(
      "beforeend",
      `
            <div class="card flipped">
            <svg class="icon icon-${this._icon}"><use xlink:href="./icons/symbol-defs.svg#icon-${this._icon}"></use></svg>
            </div>
        `
    );
    return this._holder.querySelector(".card:last-child");
  }
  setUpEvents() {
    this._ref.onclick = this.flip;
  }
  flip = () => {
    if (this._isFlipped) {
      //needs refactoring^^
      //this._ref.classList.add("flipped");
      //this._isFlipped = false;
      //_isFlipped terug false zetten
    } else {
      //flip him
      // event uitsturen
      //send event that card has been flipped
      this._ref.classList.remove("flipped");
      dispatchEvent(this._flippedEvent);
      this._isFlipped = true;
    }
  };
}
