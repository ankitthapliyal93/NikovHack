

module.exports = function(app) {
    require('controllers/feedbackController')(app);
    require('controllers/contentController')(app);
};

