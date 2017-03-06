

module.exports = function(app) {

    //This handles all the request to homepage.
    app.get('/',rootHandler);

};

function rootHandler(req, res) {
    res.render('index');
}