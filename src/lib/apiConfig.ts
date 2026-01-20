/**
 * D&D 5e API Data Sync Configuration
 *
 * This file contains all configurable settings for the API synchronization system.
 * Edit this file to customize behavior without modifying the core services.
 */

// ============================================================
// UPDATE INTERVALS (in milliseconds)
// ============================================================

export const API_UPDATE_CONFIG = {
  // How often to refresh classes from the API (default: 24 hours)
  // Set to 0 to disable auto-refresh
  CLASSES_REFRESH_INTERVAL: 1000 * 60 * 60 * 24,

  // How often to refresh spells from the API (default: 24 hours)
  // Set to 0 to disable auto-refresh
  SPELLS_REFRESH_INTERVAL: 1000 * 60 * 60 * 24,

  // How long to keep data in in-memory cache before fetching fresh data
  CACHE_DURATION: 1000 * 60 * 60, // 1 hour

  // Maximum number of parallel API requests
  MAX_PARALLEL_REQUESTS: 3,

  // Timeout for individual API requests (ms)
  REQUEST_TIMEOUT: 30000, // 30 seconds

  // Maximum size for localStorage data (bytes)
  // If data exceeds this, automatic cleanup is triggered
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
};

// ============================================================
// API ENDPOINTS
// ============================================================

export const API_ENDPOINTS = {
  // Base URL for D&D 5e API
  BASE_URL: "https://www.dnd5eapi.co/api",

  // Available endpoints
  CLASSES: "/classes",
  CLASS_DETAILS: (index: string) => `/classes/${index.toLowerCase()}`,
  CLASS_SPELLS: (index: string) => `/classes/${index.toLowerCase()}/spells`,
  SPELLS: "/spells",
  SPELL_DETAILS: (index: string) => `/spells/${index.toLowerCase()}`,

  // Future endpoints (not yet implemented)
  FEATS: "/feats",
  FEAT_DETAILS: (index: string) => `/feats/${index.toLowerCase()}`,
  BACKGROUNDS: "/backgrounds",
  BACKGROUND_DETAILS: (index: string) => `/backgrounds/${index.toLowerCase()}`,
  EQUIPMENT: "/equipment",
  EQUIPMENT_DETAILS: (index: string) => `/equipment/${index.toLowerCase()}`,
};

// ============================================================
// FALLBACK DATA BEHAVIOR
// ============================================================

export const FALLBACK_CONFIG = {
  // Use local fallback data when API is unavailable
  USE_LOCAL_FALLBACK: true,

  // Show warning to user when API is down
  SHOW_API_DOWN_WARNING: true,

  // Retry failed API requests
  ENABLE_RETRY: true,

  // Number of times to retry failed requests
  MAX_RETRIES: 3,

  // Delay between retries (ms)
  RETRY_DELAY: 1000,
};

// ============================================================
// LOCALSTORAGE CONFIGURATION
// ============================================================

export const STORAGE_CONFIG = {
  // Storage key for game data
  STORAGE_KEY: "dnd-game-data",

  // Storage key for sync metadata
  METADATA_KEY: "dnd-sync-metadata",

  // Enable localStorage persistence
  ENABLE_OFFLINE_STORAGE: true,

  // Clear old storage data on startup (useful for updates)
  CLEAR_ON_STARTUP: false,

  // Compression level (0 = no compression, 1 = gzip)
  // Note: Current implementation doesn't compress
  COMPRESSION_LEVEL: 0,
};

// ============================================================
// LOGGING AND DEBUG
// ============================================================

export const DEBUG_CONFIG = {
  // Enable debug logging to console
  ENABLE_DEBUG: false,

  // Log all API requests/responses
  LOG_API_CALLS: true,

  // Log cache hits/misses
  LOG_CACHE_EVENTS: false,

  // Log subscriber notifications
  LOG_SUBSCRIBERS: false,

  // Log storage operations
  LOG_STORAGE: false,
};

// ============================================================
// FEATURE FLAGS
// ============================================================

export const FEATURE_FLAGS = {
  // Enable API data synchronization
  ENABLE_API_SYNC: true,

  // Enable automatic background sync
  ENABLE_AUTO_SYNC: true,

  // Show data sync status indicator in UI
  SHOW_SYNC_STATUS: true,

  // Enable manual sync buttons
  ENABLE_MANUAL_SYNC: true,

  // Use API data in spell picker
  USE_API_IN_SPELL_PICKER: true,

  // Use API data in class selector
  USE_API_IN_CLASS_SELECTOR: false, // Not yet implemented

  // Use API data in feat picker
  USE_API_IN_FEAT_PICKER: false, // Not yet implemented
};

// ============================================================
// NOTIFICATION MESSAGES
// ============================================================

export const MESSAGES = {
  SYNCING: "Syncing game data from official API...",
  SYNC_COMPLETE: "Game data synchronized successfully",
  SYNC_FAILED: "Failed to sync game data. Using cached version.",
  API_UNAVAILABLE: "D&D 5e API is currently unavailable. Using cached data.",
  CACHE_CLEARED: "Cache cleared. Fresh data will be fetched on next load.",
  STORAGE_QUOTA_EXCEEDED: "Browser storage quota exceeded. Clearing old data.",
};

// ============================================================
// USAGE EXAMPLES
// ============================================================

/*
To customize behavior:

1. Faster updates (every 6 hours instead of 24):
   CLASSES_REFRESH_INTERVAL: 1000 * 60 * 60 * 6,

2. Disable auto-sync (manual only):
   CLASSES_REFRESH_INTERVAL: 0,
   SPELLS_REFRESH_INTERVAL: 0,

3. Disable offline storage:
   ENABLE_OFFLINE_STORAGE: false,

4. Disable fallback to local data:
   USE_LOCAL_FALLBACK: false,

5. Enable verbose logging:
   ENABLE_DEBUG: true,
   LOG_API_CALLS: true,
   LOG_CACHE_EVENTS: true,

6. Reduce cache time to 30 minutes:
   CACHE_DURATION: 1000 * 60 * 30,

7. Disable certain features:
   SHOW_SYNC_STATUS: false,
   ENABLE_MANUAL_SYNC: false,
*/

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validate configuration on import
 */
export function validateConfig() {
  const errors: string[] = [];

  if (API_UPDATE_CONFIG.CLASSES_REFRESH_INTERVAL < 0) {
    errors.push("CLASSES_REFRESH_INTERVAL must be >= 0");
  }

  if (API_UPDATE_CONFIG.SPELLS_REFRESH_INTERVAL < 0) {
    errors.push("SPELLS_REFRESH_INTERVAL must be >= 0");
  }

  if (API_UPDATE_CONFIG.CACHE_DURATION <= 0) {
    errors.push("CACHE_DURATION must be > 0");
  }

  if (FALLBACK_CONFIG.MAX_RETRIES < 0) {
    errors.push("MAX_RETRIES must be >= 0");
  }

  if (FALLBACK_CONFIG.RETRY_DELAY <= 0) {
    errors.push("RETRY_DELAY must be > 0");
  }

  if (errors.length > 0) {
    console.error("Configuration validation failed:", errors);
    return false;
  }

  return true;
}
