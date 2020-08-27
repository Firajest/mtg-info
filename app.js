import express from 'express';
import session from 'express-session';
// import hbs from 'hbs';
import cookieParser from 'cookie-parser';
import sessionFileStore from 'session-file-store';
import mongoose from 'mongoose';
// import methodOverride from 'method-override';
import path from 'path';
// import bodyParser from 'body-parser';

import indexRoute from './routes/index-route.js';
import userRoute from './routes/user-route.js';
import deckRoute from './routes/deck-route.js';

const app = express();
const FileStore = sessionFileStore(session);

app.set('view engine', 'hbs');
app.set('views', path.join(process.env.PWD, 'views'));

app.use(cookieParser());
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: false }));

// Подключаем mongoose.
mongoose.connect('mongodb://localhost:27017/mtg', { useNewUrlParser: true, useUnifiedTopology: true });

// start hbs views

// SESSION
app.use(session({
  store: new FileStore(),
  key: 'user_sid',
  secret: 'qwer1tyuiop2asdfgh3jklzxc4vbnmASDQW5EZXCRF6VBGTYHNM78JUIKL9OP0',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.login = req.session.user.login;
    res.locals.email = req.session.user.email;
    // console.log(res.locals);
    // next();
  }
  next();
  // return res.redirect(401, '/login');
});

/// ////////////////////////////////////here will be ROUTES
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/deck', deckRoute);
/// ///////////////////////////////////////ROUTES end here

// Allows you to use PUT, DELETE with forms.
// app.use(methodOverride((req, res) => {
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     const method = req.body._method;
//     delete req.body._method;
//     return method;
//   }
// }));

// start server
app.listen(process.env.PORT ?? 3000);

export default app;
