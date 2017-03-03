

module.exports = function(app) {

    //This handles all the request to homepage.
    app.get('/',rootHandler);

};

function rootHandler(req, res) {
	console.log('Here I am');
    res.render('index');
}