const path = require('path');
// load dependencies
var cors = require('cors');
const env = require('dotenv');
// const csrf = require('csurf');
const express = require('express');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressHbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store); // initalize sequelize with session store

const app = express();
// const csrfProtection = csrf();
const router = express.Router();

//Loading Routes
const webRoutes = require('./routes/web');
const db = require('./app/models/index');
const errorController = require('./app/controllers/ErrorController');

env.config();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'app/uploadedImages')));
// console.log(session);
// required for csurf
// app.use(
// 	session({
// 		resave: true,
// 		saveUninitialized: true,
// 		secret: process.env.SESSION_SECRET,
// 		cookie: { maxAge: 1 }, // two weeks in milliseconds
// 		store: new SequelizeStore({
// 			db: sequelize,
// 			table: 'sessions',
// 		}),
// 	})
// );

// app.use(csrfProtection);
app.use(flash());

console.log("data fro testing here")

// app.use((req, res, next) => {
// 	console.log('in if');
// 	console.log(req.session);
// 	res.locals.isAuthenticated = req.session.isLoggedIn;
// 	res.locals.csrfToken = 'req.csrfToken();';
// 	next();
// });

app.engine(
	'hbs',
	expressHbs({
		layoutsDir: 'views/layouts/',
		defaultLayout: 'web_layout',
		extname: 'hbs',
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use('/api',webRoutes);
app.use(errorController.pageNotFound);
app.get('/api/test', (req, res) => {
	res.send('Server is Up!');
});
db.sequelize
	.sync({ alter: true  })
	// .sync({})
		.then(() => {
		app.listen(process.env.PORT || 3000);
		//pending set timezone
		console.log('App listening on port ' + process.env.PORT || 3000);
	})
	.catch((err) => {
		console.log("err",  err);
	});
