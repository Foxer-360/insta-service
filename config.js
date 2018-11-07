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
  'clientId' : '4cabc7334dad4b7bbeac6de3d4bb4148',
  'clientSecret' : 'b45280497e5540e5869852d45c651aba',
  'accessToken' : '3627563442.4cabc73.6c41b1d1d92845a89422715170c6e6b3'
};

// Production enviroment
enviroments.production = {
  'port' : 5000,
  'envName' : 'production'
};

// Determine which enviroment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

console.log(currentEnvironment);
// Check that the current enviroment is one of the enviroments above, if not, default to staging
const enviromentToExport = typeof enviroments[currentEnvironment] === 'object' ? enviroments[currentEnvironment] : enviroments.staging;

module.exports = enviromentToExport;