//import { value } from "./deck.js";
import value from "./deck";
import { uniq } from "lodash";

class Hand {
  constructor(...cards) {
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
    let values = [];
    cards.forEach((c) => {
      values.push(c.value);
    });
    this.cards = cards;
    this.cards_values = values;
  }

  calcHand(player) {
    /*Estas funciones devuelven booleano, a partir de ahi, se calcula la puntuación. Las Manos que se pueden combinar formando puntuación, son mutuamente excluyentes, es decir:
        - P.e.  No puedes tener doble pareja del mismo valor ( Mano -> 2(♥), 2(♠), 2(♣), 2(♦) , x(x)) , esto, es un Póker.
        - Siempre tendrás la combinación de mayor puntuación. P.e. da igual que tengas una pareja de Ases, si ademas tienes un trio, pasas a tener un full.
      El siguiente switch-case, conmuta entre la mejor mano para seleccionarla.
    */
    switch (true) {
      case royalStraightFlush(this.cards):
        player.score = 100;
        return "Royal StraightFlush!";
        break;

      case straightFlush(this.cards, this.cards_values):
        player.score = 90;
        return "Straigh Flush!";
        break;

      case fourOfaKind(this.cards_values):
        player.score = 80;
        return "Poker!";
        break;

      case fullHouse(this.cards_values):
        player.score = 70;
        return "Full House!";
        break;

      case flush(this.cards):
        player.score = 60;

        return "Flush!";
        break;

      case straight(this.cards_values):
        player.score = 50;

        return "Straight!";
        break;

      case threeOfaKind(this.cards_values):
        player.score = 40;

        return "Three of a Kind!";
        break;

      case twoPair(this.cards_values):
        player.score = 30;

        return "Two Pair!";
        break;

      case onePair(this.cards_values):
        player.score = 20;

        return "One Pair!";
        break;

      default:
        player.score = 10;

        return "High Card!";
        break;
    }
  }
}

function royalStraightFlush(cards) {
  // Para escalera Real de color, 2 condiciones: Tener todas el mismo PALO, formar una ESCALERA al As.
  // Compruebo PALO
  if (
    cards.every((c) => c.shape === "♠") ||
    cards.every((c) => c.shape === "♣") ||
    cards.every((c) => c.shape === "♥") ||
    cards.every((c) => c.shape === "♦")
  ) {
    // Compruebo ESCALERA
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

function straightFlush(cards, values) {
  if (
    cards.every((c) => c.shape === "♠") ||
    cards.every((c) => c.shape === "♣") ||
    cards.every((c) => c.shape === "♥") ||
    cards.every((c) => c.shape === "♦")
  ) {
    // Compruebo si forman escalera

    return straight(values);
  }

  return false;
}

function fourOfaKind(values) {
  let counter = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (values[i] === values[j]) counter++;
      if (counter === 4) return true;
    }
    counter = 0;
  }
  return false;
  // console.log(counter);
  // console.log(values);
  //  if (values.length - _.uniq(values).length === 3) return true;
}

function fullHouse(values) {
  let valueEquals = uniq(values);
  let count1 = 0;
  let count2 = 0;
  if (valueEquals.length == 2) {
    values.forEach((v) => {
      if (v === valueEquals[0]) count1++;
    });
    values.forEach((v) => {
      if (v === valueEquals[1]) count2++;
    });

    if ((count1 === 3 && count2 === 2) || (count2 === 3 && count1 === 2))
      return true;
  } else return false;
}

function flush(cards) {
  if (
    cards.every((c) => c.shape === "♠") ||
    cards.every((c) => c.shape === "♣") ||
    cards.every((c) => c.shape === "♥") ||
    cards.every((c) => c.shape === "♦")
  )
    return true;
  else return false;
}

function straight(values) {
  let cont = 0;
  // Si values contiene un As y un 10 (p.e.), As pasa a valer 14 para poder formar escalera alta.
  if (values.includes(1) && values.includes(10)) {
    // Guardo para no modificar la variable
    let values2 = values;
    // Cambio valor de As a 14 para hacer la comprobación
    values2[0] = 14;
    // Re-ordeno valores
    values2.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] + 1 == values[i + 1]) cont++;
    }
  } else
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] + 1 == values[i + 1]) cont++;
    }
  if (cont == 4) return true;
  else return false;
}

function threeOfaKind(values) {
  // Método _.uniq() devuelve array sin repetidos, utilizo contadores para determinar cuantos repetidos hayde cada valor
  let valueEquals = uniq(values);
  if (valueEquals.length === 3) {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    values.forEach((v) => {
      if (v === valueEquals[0]) count1++;
    });
    values.forEach((v) => {
      if (v === valueEquals[1]) count2++;
    });
    values.forEach((v) => {
      if (v === valueEquals[2]) count3++;
    });
    if (count1 === 3 || count2 === 3 || count3 === 3) return true;
  }
  return false;
}

function twoPair(values) {
  // Método _.uniq() devuelve array sin repetidos, utilizo contadores para determinar cuantos repetidos hayde cada valor
  let valueEquals = uniq(values);
  if (valueEquals.length === 3) {
    let count = [0, 0, 0];
    values.forEach((v) => {
      if (v === valueEquals[0]) ++count[0];
    });
    values.forEach((v) => {
      if (v === valueEquals[1]) ++count[1];
    });
    values.forEach((v) => {
      if (v === valueEquals[2]) ++count[2];
    });
    if (
      (count[0] === 2 && count[1] === 2) ||
      (count[1] === 2 && count[2] === 2) ||
      (count[0] === 2 && count[2] === 2)
    )
      return true;
  }
  return false;
}

function onePair(values) {
  let valueEquals = uniq(values);
  if (valueEquals.length === 4) return true;
  return false;
}

export default Hand;
