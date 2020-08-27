import express from 'express';
import Deck from '../model/deck.js';
// import User from '../model/user.js';

const route = express.Router();

route
  .post('/new', async (req, res) => {
    const { deckName, gameFormat } = req.body;
    const author = req.session.user._id;
    const newDeck = await new Deck({
      name: deckName,
      author,
      gameFormat,
    });
    await newDeck.save();
    res.json(newDeck);
  })
  .get('/deckList', async (req, res) => {
    const deckList = await Deck.find({ author: req.session.user._id });
    // console.log(deckList);
    res.json(deckList);
  })
  // show deck
  .get('/:id', async (req, res) => {
    const deck = await Deck.findOne({ _id: req.params.id });
    const prices = deck.cards.map((card) => card.stackPrice);
    const totalPrice = prices.reduce((sum, stackPrice) => sum + stackPrice).toFixed(2);
    const cards = deck.cards.map((card) => card.quantity);
    const cardsTotal = cards.reduce((sum, stackPrice) => sum + stackPrice);
    res.render('showDeck', { deck, totalPrice, cardsTotal });
  })
  .post('/addCard', async (req, res) => {
    const { card, deckName, quantity } = req.body;
    const deck = await Deck.findOne({ name: deckName });
    const names = deck.cards.map((cardInDeck) => cardInDeck.name);
    const nameCheck = names.includes(card.name);
    console.log(card, nameCheck, quantity, (!nameCheck));
    if ((card.legalities[deck.gameFormat] === 'legal') && (!nameCheck)) {
      const cardObj = {
        name: card.name,
        price: card.prices.usd,
        image: card.image_uris.small,
        quantity,
        stackPrice: (quantity * card.prices.usd),
      };
      deck.cards.push(cardObj);
      await deck.save();
      res.json({ deck });
    } else res.json({ message: `Нельзя добавить эту карту в колоду формата ${deck.gameFormat} или эта карта уже есть в колоде` });
  })
export default route;

