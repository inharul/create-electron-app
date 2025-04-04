#!/usr/bin/env node
// This is an ESM wrapper to ensure Windows compatibility
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the main module - assuming index.js exports a function or has side effects
import('./index.js');
