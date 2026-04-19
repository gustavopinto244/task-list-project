const Login = require('../models/LoginModel.js');

function getSafeBackURL(req) {
    const allowedPaths = new Set(['/login/index', '/']);
    const referer = req.header('Referer');

    if (!referer) return '/login/index';

    try {
        const url = new URL(referer);
        if (allowedPaths.has(url.pathname)) {
            return url.pathname;
        }
    } catch (err) {
        return '/login/index';
    }

    return '/login/index';
}

exports.index = (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        // Avoid serving a cached page with an old CSRF token.
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.render('login');
    }
}

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);

        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);

            const backURL = getSafeBackURL(req);
            req.session.save(() => res.redirect(backURL));
            return;
        }
        req.flash('success', 'Registration successful! You can now log in.');
        return res.redirect('/login/index');
    } catch (e) {
        console.log(e);
        req.flash('errors', 'An error occurred while processing your request.');
        return req.session.save(() => res.redirect('/login/index'));
    }
}

exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);

        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            const backURL = getSafeBackURL(req);
            req.session.save(() => res.redirect(backURL));
            return;
        }

        req.session.user = {
            _id: login.user._id,
            name: login.user.name,
            email: login.user.email,
        };
        req.session.save(() => res.redirect('/'));
    } catch (e) {
        console.log(e);
        req.flash('errors', 'An error occurred while processing your request.');
        return req.session.save(() => res.redirect('/login/index'));
    }
}

exports.logout = function (req, res) {
    req.session.destroy(() => {
        res.redirect('/login/index');
    });
}