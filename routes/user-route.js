import express from 'express';
import bcrypt from 'bcrypt';
import User from '../model/user.js';
import Deck from '../model/deck.js';

const saltRounds = 10; // for bcrypt

const route = express.Router();

route
  .get('/register', (req, res) => {
    res.render('register');
  })
  .post('/register', async (req, res) => {
    const userCheck = await User.findOne({ email: req.body.email });
    // console.log(userCheck);
    if (!userCheck) {
      const user = new User({
        email: req.body.email,
        login: req.body.login,
        password: await bcrypt.hash(req.body.password, saltRounds),
      });
      await user.save();
      req.session.user = user;
      res.redirect('/');
    } else res.render('register', { message: 'Такой пользователь уже есть!' });
  })
  .get('/login', (req, res) => {
    res.render('login');
  })
  .post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if ((user) && (await bcrypt.compare(req.body.password, user.password))) {
      req.session.user = user;
      const { email } = user;
      req.session.user.email = email;
      res.redirect('/');
    } else res.render('login', { message: 'Что-то пошло не так, возможно опечатка в логине или пароле!' });
  })
  .get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('user_sid', { path: '/' });
      res.redirect('/');
    });
  })
  .get('/lk/:id', async (req, res) => {
    const deckList = await Deck.find({ author: req.session.user._id });
    console.log(deckList);
    // const { id } = req.params;
    res.render('lk', { deckList });
  });
export default route;
