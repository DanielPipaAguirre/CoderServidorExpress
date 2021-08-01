const express = require("express");
const exphbs = require("express-handlebars");

const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const routes = require("./routes");
const config = require("./config/config.json");
const controllersdb = require("./api/users");
const User = require("./models/users");


passport.use(
    "login",
    new LocalStrategy(
        {
            passReqToCallback: true,
        },
        function (req, username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) return done(err);
                if (!user) {
                    console.log("User Not Found with username " + username);
                    return done(
                        null,
                        false,
                        console.log("message", "User Not found.")
                    );
                }
                if (!isValidPassword(user, password)) {
                    console.log("Invalid Password");
                    return done(
                        null,
                        false,
                        console.log("message", "Invalid Password")
                    );
                }
                return done(null, user);
            });
        }
    )
);

var isValidPassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
};

passport.use(
    "signup",
    new LocalStrategy(
        {
            passReqToCallback: true,
        },
        function (req, username, password, done) {
            findOrCreateUser = function () {
                User.findOne({ username: username }, function (err, user) {
                    if (err) {
                        console.log("Error in SignUp: " + err);
                        return done(err);
                    }
                    if (user) {
                        console.log("User already exists");
                        return done(
                            null,
                            false,
                            console.log("message", "User Already Exists")
                        );
                    } else {
                        const newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
    
                        newUser.save(function (err) {
                            if (err) {
                                console.log("Error in Saving user: " + err);
                                throw err;
                            }
                            console.log("User Registration succesful");
                            return done(null, newUser);
                        });
                    }
                });
            };

            process.nextTick(findOrCreateUser);
        }
    )
);
var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// ------------------------------------------------------------------------------
//  EXPRESS
// ------------------------------------------------------------------------------

const app = express();
app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main.hbs" }));
app.set("view engine", ".hbs");

app.use(express.static(__dirname + "/views"));
app.use(require("cookie-parser")());
app.use(express.urlencoded({ extended: true }));

app.use(
    require("express-session")({
        secret: "keyboard cat",
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 10 * 60,
        },
        rolling: true,
        resave: true,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());


// ------------------------------------------------------------------------------
//  ROUTING GET POST
// ------------------------------------------------------------------------------
//  INDEX
app.get("/", routes.getRoot);

//  LOGIN
app.get("/login", routes.getLogin);
app.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/faillogin" }),
    routes.postLogin
);
app.get("/faillogin", routes.getFaillogin);

//  SIGNUP
app.get("/signup", routes.getSignup);
app.post(
    "/signup",
    passport.authenticate("signup", { failureRedirect: "/failsignup" }),
    routes.postSignup
);
app.get("/failsignup", routes.getFailsignup);

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/login");
    }
}

app.get("/ruta-protegida", checkAuthentication, (req, res) => {
    //do something only if user is authenticated
    var user = req.user;
    console.log(user);
    res.send("<h1>Ruta OK!</h1>");
});

//  LOGOUT
app.get("/logout", routes.getLogout);

//  FAIL ROUTE
app.get("*", routes.failRoute);

// ------------------------------------------------------------------------------
//  LISTEN SERVER
// ------------------------------------------------------------------------------
controllersdb.conectarDB(config.MONGO_URL, (err) => {
    if (err) return console.log("error en conexión de base de datos", err);
    console.log("BASE DE DATOS CONECTADA");

    app.listen(config.PORT, function (err) {
        if (err) return console.log("error en listen server", err);
        console.log(`Server running on port ${config.PORT}`);
    });
});
