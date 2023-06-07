module.exports = function(router) {
	router.get('/sort/:cid?', require('./index'));
};