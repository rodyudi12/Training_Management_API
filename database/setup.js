const fs = require('fs');
const path = require('path');
const { sequelize } = require('./index'); // get Sequelize instance


async function setup() {
  try {
    // Ensure /data folder exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    console.log('Syncing database...');
    
    // Sync all models & relationships
    await sequelize.sync({ alter: true }); 
    // In production you'd use migrations instead

    console.log('Database synced successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup();