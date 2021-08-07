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
//  LOGIN
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getLogin(req, res) {
    if (req.isAuthenticated()) {
        const user = req.user;
        console.log("user logueado", user);
        res.render("login-ok", {
            usuario: user.displayName,
            photo: user.photos[0].value,
            email: user.emails[0].value,
        });
    } else {
        console.log("user NO logueado");
        res.sendFile(__dirname + "/views/login.html");
    }
}

function getSignup(req, res) {
    res.sendFile(__dirname + "/views/signup.html");
}

function postLogin(req, res) {
    const user = req.user;
    //console.log(user);

    //grabo en user fecha y hora logueo
    res.sendFile(__dirname + "/views/index.html");
}

function postSignup(req, res) {
    const user = req.user;
    //console.log(user);

    //grabo en user fecha y hora logueo
    res.sendFile(__dirname + "/views/index.html");
}

function getFaillogin(req, res) {
    console.log("error en login");
    res.render("login-error", {});
}

function getFailsignup(req, res) {
    console.log("error en signup");
    res.render("signup-error", {});
}

function getLogout(req, res) {
    req.logout();
    res.sendFile(__dirname + "/views/index.html");
}

function failRoute(req, res) {
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
};
