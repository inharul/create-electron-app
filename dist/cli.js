#!/usr/bin/env node

// ESM wrapper to ensure Windows compatibility
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Importing the main module (index.js sometimes can export a function or has side effects)
import('./index.js');
