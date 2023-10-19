module.exports = function(router) {
	router.get('/:cid', require('./index'));
    router.get('/news/:category?', require('./news'));
};
