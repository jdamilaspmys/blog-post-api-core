var express = require('express');
var router = express.Router();

/* Placeholder response for users route */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
