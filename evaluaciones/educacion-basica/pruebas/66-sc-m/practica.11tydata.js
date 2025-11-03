const path = require('path');

module.exports = async function() {
  const plan = require('./plan.json');
  return { plan };
};
