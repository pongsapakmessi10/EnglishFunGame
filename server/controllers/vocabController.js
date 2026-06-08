const Word = require('../models/Word');

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find({ user: req.user.id });
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addWords = async (req, res) => {
  try {
    const wordsToAdd = req.body.words;
    
    if (!Array.isArray(wordsToAdd) || wordsToAdd.length === 0) {
      return res.status(400).json({ message: 'No words provided' });
    }

    const wordsWithUser = wordsToAdd.map(word => ({
      ...word,
      user: req.user.id
    }));

    const inserted = await Word.insertMany(wordsWithUser);
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWord = async (req, res) => {
  try {
    const wordId = req.params.id; // this is the custom string id, not _id
    let word = await Word.findOne({ id: wordId, user: req.user.id });

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Update fields
    Object.assign(word, req.body);
    await word.save();

    res.json(word);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const wordId = req.params.id;
    const word = await Word.findOneAndDelete({ id: wordId, user: req.user.id });

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json({ message: 'Word removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
