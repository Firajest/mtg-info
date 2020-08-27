/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
const resDiv = document.getElementById('searchResult');

// ------------------------------------------------------------------------fetch for searching cards
document.getElementById('searchForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  const parameter = document.getElementById('sort').value;
  const cardName = event.target.cardName.value;
  // const manaCost = event.target.manaCost.value;
  // const freeDiv = document.getElementById('cardContainer');
  const response = await fetch(`https://api.scryfall.com/cards/search?q=${cardName}`, {
    method: 'get',
    headers: {
      'Content-type': 'application/json',
    },
  });
  const result = await response.json();

  console.log(result); // all cards info
  // ------------------------------------------------------------------------Sorting
  result.sortedRes = result.data.slice();
  if (parameter === 'prices.usd' || parameter === 'cmc') {
    result.sortedRes.sort((a, b) => {
      const splitedParam = parameter.split('.'); // <<-- it's an ARRAY
      for (const key of splitedParam) {
        a = a[key];
        b = b[key];
      }
      return b - a;
    });
  }
  if (parameter === 'name') {
    result.sortedRes.sort((a, b) => a[parameter] - b[parameter]);
  }
  // ------------------------------------------------------------------------Sorting ends
  const ourResult = await fetch('/result', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      result,
    }),
  });
  const result2 = await ourResult.text();
  // console.log(result2);
  resDiv.innerHTML = result2;
  // ------------------------------------------------------------------------add card to deck
  const searchRes = document.getElementsByClassName('textContainer'); // all search forms
  Array.from(searchRes).forEach((form) => form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // .parentElement
    const emptyDiv = e.target.parentElement.nextElementSibling;
    const id = e.target.lastElementChild.firstElementChild.id;
    const card = result.data.filter((cardId) => cardId.id === id)[0];
    console.log(e.target, id, card);
    // fetch for deckList
    const deckListData = await fetch('/deck/deckList');
    const deckListArr = await deckListData.json();
    // console.log(deckListArr);
    // fetch for taking hbs with sub form to add a card
    const hbsData = await fetch('/hbs/addCard.hbs');
    const HBShtml = await hbsData.text();
    const template = Handlebars.compile(HBShtml);
    const html = template({ deck: deckListArr });
    emptyDiv.innerHTML = html;

    const subForms = document.getElementsByName('subForm');
    Array.from(subForms).forEach((subform) => subform.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const deckName = e.target.deckName.value;
      const quantity = e.target.quantity.value;
      // console.log(e.target, deckName, quantity);
      const addCardData = await fetch('/deck/addCard', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          deckName,
          quantity,
          card,
        }),
      });
      const addCardResp = await addCardData.json();
      if (addCardResp.message) {

        if (!e.target.nextElementSibling) {
          const message = document.createElement('span');
          message.style.color = 'red';
          message.innerText = addCardResp.message;
          e.target.parentElement.appendChild(message);
          console.log(message, message.value, e.target.parentElement);
        }
      }
    }));
  }));
  // ------------------------------------------------------------------------add card to deck ENDS
});

// ------------------------------------------------------------------------fetch for searching ENDS

// ------------------------------------------------------------------------add card to deck
// resDiv.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const { id } = e.target.lastElementChild.firstElementChild;
//   console.log(e.target, id);
// });
// ------------------------------------------------------------------------add card to deck ENDS

// ----------------------------------------------------------------------- ajax new deck
document.getElementById('newDeck')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('got it');

  const deckList = document.getElementById('deckList');
  const deckName = document.getElementById('deckName').value;
  const gameFormat = document.getElementById('gameFormat').value;
  // fetch for DATA
  const data = await fetch('/deck/new', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      deckName,
      gameFormat,
    }),
  });
  const dataResponse = await data.json();
  // console.log(dataResponse);
  // fetch for deckList
  const deckListData = await fetch('/deck/deckList');
  const deckListResponse = await deckListData.json();
  // fetch for hbs
  const hbsData = await fetch('/hbs/deckList.hbs');
  const HBShtml = await hbsData.text();
  const template = Handlebars.compile(HBShtml);
  const html = template({ deckList: deckListResponse });
  // console.log(html);
  deckList.innerHTML = html;
});
// ----------------------------------------------------------------------- ajax new deck ENDS
