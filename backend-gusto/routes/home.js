const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ welcomeText: 'Say Hello to My Little Friend!' });
});

module.exports = router;