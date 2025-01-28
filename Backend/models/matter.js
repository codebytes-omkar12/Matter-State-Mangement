const mongoose = require('mongoose');

const matterSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  state: { type: String, enum: ['gaseous', 'liquid', 'solid'], default: 'gaseous' },
  stateHistory: [{ state: String, updatedAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

matterSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified('state')) {
    this.stateHistory.push({ state: this.state, updatedAt: new Date() });
  }
  next();
});

module.exports = mongoose.model('Matter', matterSchema);
