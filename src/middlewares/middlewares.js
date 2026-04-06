const e = require("connect-flash");

exports.globalMiddleware = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if (!err) return next();

    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).render('errors/403');
    }

    return next(err);
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}