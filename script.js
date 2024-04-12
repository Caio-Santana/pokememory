'use strict';

// https://pokeapi.co/api/v2/pokemon-form/{id or name}/

// imagens 96 x 96

/*
estrutura {
  pokemon:
    name: string
  sprites:
    back_default: url
    front_default: url
}
*/

const MAX_CARDS = 30;

const containerEl = document.querySelector('.card-container');
const btnResetEl = document.getElementById('btn-reset');

const pokemons = [];

class Pokemon {
  constructor(pokemonName, urlFront, urlBack) {
    this.pokemonName = pokemonName;
    this.urlFront = urlFront;
    this.urlBack = urlBack;
  }
}

const getJSON = async function (url, errorMsg = 'Something went wrong') {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${errorMsg} (${response.status})`);
  }
  return await response.json();
};

const shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [array[i], array[random]] = [array[random], array[i]];
  }
};

const createCard = function (pokemon) {
  const cardEl = document.createElement('div');
  cardEl.classList.add(...['card', 'card-turn']);
  cardEl.dataset.pokemon = pokemon.pokemonName;

  const cardFrontEl = document.createElement('div');
  cardFrontEl.classList.add('card-front');

  const cardBackEl = document.createElement('div');
  cardBackEl.classList.add('card-back');

  const imgFrontEl = document.createElement('img');
  imgFrontEl.src = pokemon.urlFront;
  imgFrontEl.alt = pokemon.pokemonName;

  const imgBackEl = document.createElement('img');
  imgBackEl.src = './pokeball.png';
  imgBackEl.alt = 'pokeball';

  containerEl.insertAdjacentElement('beforeend', cardEl);
  cardEl.insertAdjacentElement('beforeend', cardFrontEl);
  cardFrontEl.insertAdjacentElement('beforeend', imgFrontEl);
  cardEl.insertAdjacentElement('beforeend', cardBackEl);
  cardBackEl.insertAdjacentElement('beforeend', imgBackEl);
};

const init = function () {
  const pokemonArray = [];

  while (pokemonArray.length < MAX_CARDS) {
    const i = Math.floor(Math.random() * MAX_CARDS);

    if (!pokemonArray.includes(pokemons[i])) {
      pokemonArray.push(pokemons[i]);
      pokemonArray.push(pokemons[i]);
    }
  }

  shuffle(pokemonArray);
  pokemonArray.forEach((p) => createCard(p));
};

(async function loadPokemonsData() {
  try {
    let pokemonsData = localStorage.getItem('pokemons');
    if (pokemonsData) {
      console.log('carregando do localStorage');
      const pokemonsArr = JSON.parse(pokemonsData);
      pokemonsArr.forEach((p) =>
        pokemons.push(new Pokemon(p.pokemonName, p.urlFront, p.urlBack))
      );
    } else {
      const data = await Promise.all([
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'pikachu'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'charizard'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'blastoise'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'arbok'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'arcanine'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'articuno'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'beedrill'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'venusaur'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'butterfree'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'chansey'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'dugtrio'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'onix'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'psyduck'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'jigglypuff'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'snorlax'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'machamp'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'magnemite'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'parasect'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'staryu'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'tangela'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'tauros'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'togepi'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'jynx'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'voltorb'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'electrode'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'vulpix'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'zapdos'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'magneton'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'mankey'}/`),
        getJSON(`https://pokeapi.co/api/v2/pokemon-form/${'mewtwo'}/`),
      ]);

      const pokemonsArr = data.map((p) => {
        const {
          pokemon: { name },
          sprites: { front_default, back_default },
        } = p;

        return new Pokemon(name, front_default, back_default);
      });

      console.log('salvando no localStorage');
      localStorage.setItem('pokemons', JSON.stringify(pokemonsArr));
      pokemonsArr.forEach((p) => pokemons.push(p));
    }

    init();
  } catch (error) {
    console.error(`Ops! ${error.message}`);
  }
})();

const showPokemon = function (card) {
  card.classList.remove('card-turn');
};

const hidePokemon = function (card) {
  card.classList.add('card-turn');
};

const hideCardsWrongGuess = function (card1, card2) {
  setTimeout(() => {
    hidePokemon(card1);
    hidePokemon(card2);
  }, 1000);
};

// event handlers

let lastCardElClicked;

containerEl.addEventListener('click', function (e) {
  const card = e.target.closest('.card-turn');

  // clicked other element than a card
  if (!card) return;

  const pokemonClicked = card.dataset.pokemon;

  showPokemon(card);

  // clicked same card
  if (lastCardElClicked === card) {
    return;
  }

  // first card clicked
  if (lastCardElClicked === undefined) {
    lastCardElClicked = card;
    return;
  }

  if (lastCardElClicked.dataset.pokemon === pokemonClicked) {
    console.log('Correct!');
  } else {
    console.log('Wrong!');
    hideCardsWrongGuess(card, lastCardElClicked);
  }

  lastCardElClicked = undefined;
});

btnResetEl.addEventListener('click', function(e) {
  e.preventDefault();

  containerEl.innerHTML = '';
  init();
  lastCardElClicked = undefined;
})
