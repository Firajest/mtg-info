import mongoose from 'mongoose';
import User from './user.js';

const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  cards: [{
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    stackPrice: {
      type: Number,
    },
  }],
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  gameFormat: {
    type: String,
  },
});

export default mongoose.model('Deck', deckSchema);
