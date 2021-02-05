import Card from "./Card";

export default class Memory {
  constructor(username, lvl = 1) {
    this._allIcons = [];
    this._lvl = lvl;
    this._username = username;
    this._first = null;
    this._second = null;
    this._found = [];
    //this._selected = [];
    //this._turned = [];
    if (localStorage.getItem("xyz")) {
      const persistedData = JSON.parse(localStorage.getItem("xyz"));
      this._lvl = persistedData.lvl;
      this._allIcons = persistedData.icons;
      this.init();
      //...
    } else {
      this.fetchIcons();
    }
    this.setUpEvents();
    //setUpEvents => luisteren naar flipped eventTypes
  }
  saveToPersist() {
    localStorage.setItem(
      "xyz",
      JSON.stringify({
        lvl: this._level,
        icons: this._allIcons,
      })
    );
  }
  fetchIcons() {
    fetch("../../icons/selection.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this._allIcons = data.icons.map((el) => el.properties.name);
        console.log(this._allIcons);
        this.init();
      })
      .catch((error) => console.log(error));
  }
  init() {
    //initiele html opbouwen (<div id="grid"></div>)
    this.startLevel();
  }
  startLevel() {
    // cards/lvl 4,8,16,32...import math math.pow 2^1+this._lvl also
    let cardAmount = Math.pow(2, 1 + this._lvl);
    //console.log(cardAmount);
    let iconsLevel = [];
    while (iconsLevel.length < cardAmount / 2) {
      //random number between 0 and length of allicons array
      let randomNumber = Math.floor(Math.random() * this._allIcons.length);
      //indexof returns -1 if no results found
      if (iconsLevel.indexOf(randomNumber) === -1) {
        iconsLevel.push(randomNumber);
      }
    }
    //'select' icon from allicons using the random number generated
    iconsLevel = iconsLevel.map((x) => this._allIcons[x]);
    // add a copy of the array to itself, now we have 2 of each icons
    iconsLevel = iconsLevel.concat(iconsLevel);
    //function that ranomises array order
    function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    }
    // randomising iconslevel
    shuffle(iconsLevel);
    //console.log(iconsLevel);

    //voor elk icoon in iconslevel maken we een card met dat icoon aan
    iconsLevel.forEach((x) => {
      new Card(document.querySelector(".cardContainer"), x);
    });
  }
  //listens for flipped event
  setUpEvents() {
    window.addEventListener("flipped", (x) => this.flipped(x));
  }
  // flipped function, check if firstcard is set, if not set it as card
  // if you select multiple cards fast, doesnt work properly! need to fix..
  flipped(card) {
    if (!this._first) {
      this._first = card.detail;
      console.log(this._first._icon);

      //else we set it as secondcard, and perform a check if they have the same icon
    } else {
      this._second = card.detail;
      console.log(this._first._icon);
      console.log(this._second._icon);
      console.log(this.checkCards(this._first, this._second));
      if (this.checkCards(this._first, this._second)) {
        //turn cards green on correct guess
        this._first._ref.classList.add("correct");
        this._second._ref.classList.add("correct");
        //push correct into array
        this._found.push(this._second._icon);
        //reset first and second
        this.resetCards();
        console.log(this._found.length);
        console.log(Math.pow(2, 1 + this._lvl) / 2);
        console.log(this._found);
        //if all cards found proceed to next level
        if (this._found.length === Math.pow(2, 1 + this._lvl) / 2) {
          this._found = [];
          this._lvl += 1;
          // clear cards from previous level
          document.querySelector(".cardContainer").innerHTML = "";
          new Memory(this._username, this._lvl);
          console.log("level completed");
        }
      } else {
        //timeout otherwise it instantly flips back and you cant see what secondcard was
        //clicking >2 in quick succession breaks it, add timeout to check function instead??
        setTimeout(this.flipBack, 1000);
      }
    }
  }
  flipBack = () => {
    //change appearence
    this._first._ref.classList.add("flipped");
    this._second._ref.classList.add("flipped");
    //make it clickable again
    this._first._isFlipped = false;
    this._second._isFlipped = false;

    this.resetCards();
  };
  //checks if the icons of the cards match
  checkCards = (a, b) => {
    return a._icon === b._icon;
  };

  //reseting first and second card values
  resetCards = () => {
    this._first = null;
    this._second = null;
  };
}
