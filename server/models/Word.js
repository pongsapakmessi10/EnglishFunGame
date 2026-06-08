const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: String,
    required: true
  },
  eng: {
    type: String,
    required: true
  },
  thai: {
    type: String,
    required: true
  },
  ipa: String,
  pos: String,
  enDefinition: String,
  thaiDef: String,
  synonyms: String,
  example: String,
  exThai: String,
  tenses: String,
  wordFamily: String,
  affixes: String
}, { timestamps: true });

module.exports = mongoose.model('Word', WordSchema);
