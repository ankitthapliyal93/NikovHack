

module.exports = function(app) {
    require('controllers/feedbackController')(app);
    require('controllers/contentController')(app);
    require('controllers/uploadController')(app);
};

