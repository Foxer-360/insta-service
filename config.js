/**
 * Create and export configuration variables
 * 
 */

// Container for all the enviroments
const enviroments = {};

// Staging (default) enviroment
enviroments.staging = {
  'port' : 3000,
  'envName' : 'staging',
  'clientId' : process.env.CLIENT_ID,
  'clientSecret' : process.env.CLIENT_SECRET,
  'accessToken' : process.env.ACCESS_TOKEN
};

// Production enviroment
enviroments.production = {
  'port' : 5000,
  'envName' : 'production',
  'clientId' : process.env.CLIENT_ID,
  'clientSecret' : process.env.CLIENT_SECRET,
  'accessToken' : process.env.ACCESS_TOKEN
};

// Determine which enviroment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

console.log(currentEnvironment);
// Check that the current enviroment is one of the enviroments above, if not, default to staging
const enviromentToExport = typeof enviroments[currentEnvironment] === 'object' ? enviroments[currentEnvironment] : enviroments.staging;

module.exports = enviromentToExport;