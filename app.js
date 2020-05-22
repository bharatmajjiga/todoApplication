const express = require('express');
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();

mongoose.Promise = global.Promise;

//DB config
const db = require('./config/database');

//connect to mongoose
mongoose.connect(db.mongoURI , {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

//load routes
const ideas = require('./routes/ideas');
const user = require('./routes/user');

//Passport config
require('./config/passport')(passport);

// Handlebar MiddleWare
app.engine('handlebars', exphbs({   
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect-flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Index Route
app.get('/', (req, res) => {
    const title = 'MyApp';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
})

//use routes
app.use('/ideas', ideas);
app.use('/users', user);

const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});