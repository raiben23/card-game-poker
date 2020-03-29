import { value } from "./deck.js";

export default class Hand {
  constructor(...cards) {
    this.cards = cards;
  }

  calcHand() {
    /*Estas funciones devuelven booleano, a partir de ahi, se calcula la puntuación. Las Manos que se pueden combinar formando puntuación, son mutuamente excluyentes, es decir:
        - P.e.  No puedes tener doble pareja del mismo valor ( Mano -> 2(♥), 2(♠), 2(♣), 2(♦) , x(x)) , esto, es un Póker.
        - Siempre tendrás la combinación de mayor puntuación. P.e. da igual que tengas una pareja de Ases, si ademas tienes un trio, pasas a tener un full.
      El siguiente switch-case, conmuta entre la mejor mano para seleccionarla.
    */
    switch (true) {
      case royalStraightFlush(this.cards):
        console.log("Tienes una escalera real de color!");

        break;

      case straightFlush(this.cards):
        console.log("Tienes una escalera de color!");

        break;

      default:
        console.log("no tienes nada...");

        break;
    }

    // straightFlush(this.cards);
    // fourOfaKind(this.cards);
    // fullHouse(this.cards);
    // flush(this.cards);
    // straight(this.cards);
    // threeOfaKind(this.cards);
    // twoPair(this.cards);
    // onePair(this.cards);
    // highCard(this.cards);
  }
}
function royalStraightFlush(cards) {
  // Para escalera Real de color, 2 condiciones: Tener todas el mismo PALO, formar una ESCALERA al As.

  // Comprobamos PALO

  if (
    cards.every(
      c => c.shape == "♦" || c.shape == "♠" || c.shape == "♣" || c.shape == "♥"
    )
  ) {
    // Comprobamos ESCALERA
    // Primero ordeno la mano
    cards.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    // ¿Forman escalera?
    // En este caso, como solo hay un posible resultado (escalera real) no compruebo si forma escalera compruebo directamente si es una escalera real.
    // ¿Escalera al As?
    // Como el As juega un papel especial, ira al final de la escalera únicamente si se cumple: As, 10, J, Q, K  -----> 10, J, Q, K, As
    if (
      cards[0].value == value.ACE &&
      cards[1].value == value.TEN &&
      cards[2].value == value.J &&
      cards[3].value == value.Q &&
      cards[4].value == value.K
    ) {
      // Pongo el As al final, se ha formado la escalera real
      let ace = cards.shift();
      cards.push(ace);
      cards;
      return true;
    }
  }
  return false;
  // Cualquier otro caso NO es una escalera real de color: false
}

function straightFlush(cards) {
  // Primero ordeno la mano
  cards.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  //
  if (cards.every((c, i) => c.value[i] == c.value[i + 1] - 1)) {
    console.log("forman escalera");
    return true;
  }
  // solo hay un espacio entre
}
