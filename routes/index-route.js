import express from 'express';
import Deck from '../model/deck.js';

const route = express.Router();

route
  .get('/', (req, res) => {
    res.render('index');
  })
  .post('/result', (req, res) => {
    res.render('result', { result: req.body.result, layout: false });
  });
export default route;
