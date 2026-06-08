const express = require('express');
const router = express.Router();
const vocabController = require('../controllers/vocabController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, vocabController.getWords);
router.post('/bulk', auth, vocabController.addWords);
router.put('/:id', auth, vocabController.updateWord);
router.delete('/:id', auth, vocabController.deleteWord);

module.exports = router;
