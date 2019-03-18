module.exports = function (modules) {
    return (req, res, next) => {
        // req.header('User-Agent');
        console.log('Route served: ' + req.url);
        if (req.url != '/auth/log-in') {
            console.log(req.header('Auth-token'));
            console.log(req.header('Auth-email'));
            modules.AuthModule.getAuthorizer().authorize(req.header('Auth-email'), req.header('Auth-token'))
                .then((response) => {
                console.log(response);
                next();
            })
                .catch((response) => {
                res.write(response.toString());
                res.end();
            });
        }
        else {
            next();
        }
    };
};
//# sourceMappingURL=auth-middleware.js.map