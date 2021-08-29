const express = require("express");
const exphbs = require("express-handlebars");
const compression = require("compression");
const log4js = require("log4js");

const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const routes = require("./routes");
const config = require("./config/config.json");
const controllersdb = require("./api/users");
const User = require("./models/users");
const chat = require("./api/chat");
const normalizr = require("normalizr");
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const normalize = normalizr.normalize;
const schema = normalizr.schema;

dotenv.config();

// completar con sus credenciales
const FACEBOOK_CLIENT_ID = process.argv[3] || process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET =
    process.argv[4] || process.env.FACEBOOK_CLIENT_SECRET;

/* passport.use(
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
); */

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "emails"],
            scope: ["email"],
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(JSON.stringify(profile, null, 3));
            let userProfile = profile;
            return done(null, userProfile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/* var isValidPassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
};
 */
/* passport.use(
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
); */

/* var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}; */

// ------------------------------------------------------------------------------
//  EXPRESS
// ------------------------------------------------------------------------------

const app = express();
const http = require("http");
const server = http.createServer(app);
app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main.hbs" }));
app.set("view engine", ".hbs");

app.use(express.static(__dirname + "/views"));
app.use(require("cookie-parser")());
// app.use(express.json());
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

app.use(compression());

log4js.configure({
    appenders: {
        miLoggerConsole: { type: "console" },
        miLoggerWarn: { type: "file", filename: "warn.log" },
        miLoggerError: { type: "file", filename: "error.log" },
    },
    categories: {
        default: { appenders: ["miLoggerConsole"], level: "trace" },
        info: { appenders: ["miLoggerConsole"], level: "info" },
        warn: {
            appenders: ["miLoggerConsole", "miLoggerWarn"],
            level: "warn",
        },
        error: {
            appenders: ["miLoggerConsole", "miLoggerError"],
            level: "error",
        },
    },
});

// ------------------------------------------------------------------------------
//  ROUTING GET POST
// ------------------------------------------------------------------------------
//  INDEX
app.get("/", routes.getRoot);

// INFO
app.get("/info", routes.getInfo);
app.get("/info-nobloq", routes.getInfoNoBloq);

// RANDOM
app.get("/randoms", routes.getRandom);

//  LOGIN
app.get("/login", routes.getLogin);
/* app.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/faillogin" }),
    routes.postLogin
);  */
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/login",
        failureRedirect: "/faillogin",
    })
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

// SOCKET IO
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", async (socket) => {

    const messages = await chat.findAll();

    // json normalize
    const mensajesConId = {
        id: "mensajes",
        mensajes: messages.map((mensaje) => ({ ...mensaje._doc })),
    };
    const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "id" });

    const schemaMensaje = new schema.Entity(
        "post",
        { author: schemaAuthor },
        { idAttribute: "_id" }
    );
    const schemaMensajes = new schema.Entity(
        "posts",
        { mensajes: [schemaMensaje] },
        { idAttribute: "id" }
    );

    const normalizedData = normalize(mensajesConId, schemaMensajes);

    io.sockets.emit("mensajes", normalizedData);

    socket.on("nuevo-mensaje", async function (data) {
        await chat.create(data);
        const messages = await chat.findAll();

        // json normalize
        const mensajesConId = {
            id: "mensajes",
            mensajes: messages.map((mensaje) => ({ ...mensaje._doc })),
        };
        const schemaAuthor = new schema.Entity(
            "author",
            {},
            { idAttribute: "id" }
        );

        const schemaMensaje = new schema.Entity(
            "post",
            { author: schemaAuthor },
            { idAttribute: "_id" }
        );
        const schemaMensajes = new schema.Entity(
            "posts",
            { mensajes: [schemaMensaje] },
            { idAttribute: "id" }
        );

        const normalizedData = normalize(mensajesConId, schemaMensajes);

        io.sockets.emit("mensajes", normalizedData);
    });
});

const routerProduct = require("./routes/productos");
app.use("/api", routerProduct);

// ------------------------------------------------------------------------------
//  LISTEN SERVER
// ------------------------------------------------------------------------------

// require("./database/connection");

const PORT = process.argv[2] || process.env.PORT;

controllersdb.conectarDB(config.MONGO_URL, (err) => {
    if (err) return console.log("error en conexión de base de datos", err);
    /* console.log("BASE DE DATOS CONECTADA"); */

    // CLUSTER
    if (cluster.isMaster && process.argv[3] === "CLUSTER") {
        console.log("num CPUs", numCPUs);
        console.log(`PID MASTER ${process.pid}`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork(); // creamos un worker para cada cpu
        }

        // controlamos la salida de los workers
        cluster.on("exit", (worker) => {
            console.log("Worker", worker.process.pid, "died");
        });
    } else {
        server.listen(PORT, function (err) {
            if (err) return console.log("error en listen server", err);
            console.log(`Server running on port ${PORT}`);
        });
    }
});
