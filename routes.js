const { fork } = require("child_process");
const numCPUs = require("os").cpus().length;
const log4js = require("log4js");

const loggerWarn = log4js.getLogger("warn");
const loggerError = log4js.getLogger("error");
const loggerInfo = log4js.getLogger("info");

// ------------------------------------------------------------------------------
//  ROUTING
// ------------------------------------------------------------------------------

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  INDEX
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getRoot(req, res) {
    res.send("Bienvenido al ejemplo de passport con facebook");
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  INFO
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getInfo(req, res) {
    const PORT = parseInt(process.argv[2]);
    res.render("info", {
        argv: process.argv,
        so: process.platform,
        version: process.version,
        memory: process.memoryUsage(),
        path: process.execPath,
        pid: process.pid,
        folder: process.cwd(),
        cpu: numCPUs,
        data: `Servidor express (Nginx) en ${PORT} - PID ${
            process.pid
        } - ${new Date().toLocaleString()}`,
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  RANDOM
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getRandom(req, res) {
    const max = req.query.cant || 100000000;
    const computo = fork("./computo.js");
    computo.send(max);
    computo.on("message", (element) => {
        res.json(element);
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  LOGIN
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getLogin(req, res) {
    if (req.isAuthenticated()) {
        const user = req.user;
        loggerInfo.info("user logueado");
        res.render("login-ok", {
            usuario: user.displayName,
            photo: user.photos[0].value,
            email: user.emails[0].value,
        });
    } else {
        loggerError.error("user NO logueado");
        res.sendFile(__dirname + "/views/login.html");
    }
}

function getSignup(req, res) {
    res.sendFile(__dirname + "/views/signup.html");
}

function postLogin(req, res) {
    res.sendFile(__dirname + "/views/index.html");
}

function postSignup(req, res) {
    res.sendFile(__dirname + "/views/index.html");
}

function getFaillogin(req, res) {
    loggerError.error("error en login");
    res.render("login-error", {});
}

function getFailsignup(req, res) {
    loggerError.error("error en signup");
    res.render("signup-error", {});
}

function getLogout(req, res) {
    loggerWarn.warn("Usuario deslogueado")
    req.logout();
    res.sendFile(__dirname + "/views/index.html");
}

function failRoute(req, res) {
    loggerError.error("No tiene acceso a esta ruta");
    res.status(404).render("routing-error", {});
}

module.exports = {
    getRoot,
    getLogin,
    postLogin,
    getFaillogin,
    getLogout,
    failRoute,
    getSignup,
    postSignup,
    getFailsignup,
    getInfo,
    getRandom,
};
