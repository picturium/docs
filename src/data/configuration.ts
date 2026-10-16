// Configuration & operations tables. Source of truth: picturium2/src/config,
// src/state.rs, src/multithreading.rs, src/health.rs and config.toml.example.
export const sections = [
  '[server]', '[security]', '[cors]', '[vips]', '[data]',
  '[cache]: [cache.memory], [cache.disk]',
  '[svg]', '[pdf]', '[image]',
  '[watermark]: [watermark.image],[watermark.text]',
  '[output]: [output.quality_curves], [output.quality_curves.<format>], [output.encoder.<format>]',
  '[office]', '[vector]', '[video]',
];

export const envExamples = [
  ['PICTURIUM__SERVER__PORT=8080', 'server.port', 'Listen on port 8080.'],
  ['PICTURIUM__SERVER__WORKERS=8', 'server.workers', 'Allow 8 images to render at once instead of using twice the CPU count.'],
  ['PICTURIUM__CACHE__MEMORY__ENABLED=false', 'cache.memory.enabled', 'Disk-only cache.'],
  ['PICTURIUM__CACHE__DISK__LIMIT=4096', 'cache.disk.limit', 'Use a 4 GiB disk cache.'],
  ['PICTURIUM__CORS__ALLOWED_ORIGINS=https://app.example,https://cdn.example', 'cors.allowed_origins', 'Two explicit origins (comma-separated list).'],
  ['PICTURIUM__OUTPUT__QUALITY_CURVES__JPEG__MIN=40', 'output.quality_curves.jpeg.min', 'Keep single underscores inside key names; use double underscores only between levels.'],
  ['PICTURIUM__OUTPUT__ENCODER__AVIF__BITDEPTH=10', 'output.encoder.avif.bitdepth', '10-bit AVIF output.'],
];

export const cacheKeys = [
  ['cache.dir', '"cache"', 'Directory used by the disk cache. Only one picturium process can use it at a time.'],
  ['cache.cache_control', '"public, max-age=604800, must-revalidate"', 'Sent verbatim on every 200. A force=true response sends no-store instead.'],
  ['cache.memory.enabled', 'true', 'Checks the memory cache before the disk cache.'],
  ['cache.memory.limit', '256', 'MiB of total memory held by the memory cache. Entries are charged their own size.'],
  ['cache.memory.entry_limit', '2', 'MiB. A render larger than this skips memory: to disk if enabled, otherwise served uncached.'],
  ['cache.disk.enabled', 'true', 'Enables the disk cache and locks its directory for this process.'],
  ['cache.disk.limit', '1024', 'MiB of effective capacity, shared by finished responses and Office / SVG / video intermediates. foyer evicts and reclaims automatically.'],
  ['cache.disk.entry_limit', '16', 'MiB. Largest single response written to disk, and foyer\'s block size — the unit it reclaims in.'],
];

export const concurrencyKeys = [
  ['server.workers', '0', 'Maximum number of images rendered at once. 0 means twice the logical CPU count.'],
  ['server.queue_size', '100', 'Maximum number of requests waiting for a worker. A full queue rejects new requests.'],
  ['vips.concurrency', '1', 'Threads libvips uses inside a single operation. Total threads ≈ workers × vips.concurrency.'],
];

export const corsLogKeys = [
  ['cors.allowed_origins', '["*"]', 'Use "*" to allow every origin, method, and header. Otherwise, list each allowed origin exactly. Invalid entries are ignored.'],
  ['server.log_level', '"debug"', 'Sets log detail to debug, info, warn, or error. RUST_LOG overrides this value when set.'],
  ['vips.debug', 'false', 'Turns on libvips leak checking and prints the objects still alive at shutdown. Diagnostics only; it adds overhead.'],
];

export const health = [
  ['healthy', 'Normal operation.'],
  ['warning', 'Free queue slots have fallen below 10% of the worker count.'],
  ['unhealthy', 'No free worker and no free queue slot.'],
];
