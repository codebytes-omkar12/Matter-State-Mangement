const Matter = require('../models/matter');
const { loadSolidMatters } = require('./solidMatters');

async function initializeServer() {
  const solidMatters = loadSolidMatters();

  await Matter.deleteMany({ state: { $ne: 'solid' } });

  for (const matter of solidMatters) {
    const existing = await Matter.findOne({ id: matter.id });
    if (!existing) {
      await Matter.create(matter);
    }
  }
}

module.exports = initializeServer;
