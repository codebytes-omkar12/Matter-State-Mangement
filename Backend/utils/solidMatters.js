const fs = require('fs');
const path = require('path');

const solidMattersFile = path.join(__dirname, '../data/solidMatters.json');

function loadSolidMatters() {
  if (fs.existsSync(solidMattersFile)) {
    const data = fs.readFileSync(solidMattersFile, 'utf-8');
    if (data.trim() === "") {
      return [];
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Error parsing JSON from solidMattersFile:", err.message);
      return [];
    }
  }
  return [];
}

function saveSolidMatters(matters) {
  fs.writeFileSync(solidMattersFile, JSON.stringify(matters, null, 2));
}

module.exports = { loadSolidMatters, saveSolidMatters };
