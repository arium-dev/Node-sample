// This is important as it allows us to
// solve much of the boilerplate issues
// around async error handling in express
function handle(h) {
    return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next);
  }
  
  module.exports = { handle };
  