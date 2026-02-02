#!/usr/bin/env node

const http = require('http');
const express = require('express');
const RED = require('node-red');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Polyfill for deprecated util.log (removed in Node.js 14+)
if (!util.log) {
  util.log = function(msg) {
    console.log('%s - %s', new Date().toISOString(), msg);
  };
}

// Parse CLI arguments
const program = new Command();
program
  .name('node-red-binary')
  .description('Node-RED standalone binary')
  .option('-s, --settings <path>', 'Path to settings.json')
  .option('-u, --userDir <path>', 'Path to user directory')
  .option('-p, --port <number>', 'Port number')
  .parse(process.argv);

const options = program.opts();

// Load settings from file if provided
let fileSettings = {};
if (options.settings) {
  const settingsPath = path.resolve(options.settings);
  try {
    if (fs.existsSync(settingsPath)) {
      const settingsContent = fs.readFileSync(settingsPath, 'utf8');
      fileSettings = JSON.parse(settingsContent);
      console.log(`Loaded settings from: ${settingsPath}`);
    } else {
      console.warn(`Warning: Settings file not found at ${settingsPath}`);
    }
  } catch (err) {
    console.error(`Error loading settings file: ${err.message}`);
    process.exit(1);
  }
}

// Merge configuration: CLI args > settings file > defaults
const port = parseInt(options.port) || fileSettings.uiPort || 6878;
const userDir = options.userDir
  ? path.resolve(options.userDir)
  : fileSettings.userDir
  ? path.resolve(fileSettings.userDir)
  : path.join(process.env.HOME || process.env.USERPROFILE, '.node-red');

// Build Node-RED settings with proper logging configuration
const settings = {
  httpAdminRoot: '/admin',
  httpNodeRoot: '/api',
  userDir: userDir,
  uiPort: port,
  flowFile: 'flows.json',
  logging: {
    console: {
      level: 'info',
      metrics: false,
      audit: false
    }
  },
  ...fileSettings,
  // Override with CLI values if provided
  ...(options.userDir && { userDir: path.resolve(options.userDir) }),
  ...(options.port && { uiPort: parseInt(options.port) })
};

// Ensure user directory exists
if (!fs.existsSync(settings.userDir)) {
  fs.mkdirSync(settings.userDir, { recursive: true });
  console.log(`Created user directory: ${settings.userDir}`);
}

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Node-RED
RED.init(server, settings);

// Mount Node-RED routes
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);

// Start the server
server.listen(port, () => {
  console.log(`\nNode-RED standalone binary starting...`);
  console.log(`User directory: ${settings.userDir}`);
  console.log(`Server listening on port ${port}`);
  console.log(`Node-RED admin UI: http://localhost:${port}${settings.httpAdminRoot}`);
  console.log(`Node-RED API endpoint: http://localhost:${port}${settings.httpNodeRoot}`);
  console.log(`\nPress Ctrl+C to stop\n`);

  // Start Node-RED runtime
  RED.start().then(() => {
    console.log('Node-RED runtime started successfully');
  }).catch((err) => {
    console.error('Error starting Node-RED runtime:', err);
    process.exit(1);
  });
});

// Graceful shutdown handler
process.on('SIGINT', () => {
  console.log('\n\nShutting down Node-RED...');
  RED.stop().then(() => {
    console.log('Node-RED stopped');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }).catch((err) => {
    console.error('Error during shutdown:', err);
    process.exit(1);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
