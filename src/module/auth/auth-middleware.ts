module.exports = function(modules) {
    return (req, res, next) => {     
        if(req.url != '/auth/log-in' && req.url != '/healthcheck') {

            modules().AuthModule
            .getAuthorizer()
            .authorize(req.header('Auth-email'), req.header('Auth-token'))
            .then( (response) => {
                // console.log(response);
                next();
            })
            .catch( (response) => {
                res.status(401);
                res.write(response.toString());
                res.end();
            });
        } else {
            next();
        } 
    }
}
