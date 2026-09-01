// Docs information architecture for the /docs subpage.
// Grounded in picturium2 (src/params, src/enums, src/config, src/process) and
// picturium2/url_params.md. Each `page` is a doc yet to be written; `params`
// lists the URL params / config keys that page owns, so nothing is orphaned.

export interface DocPage {
  title: string;
  slug: string;
  summary: string;
  params?: string[];
}

export type DocGroupSlug = 'basics' | 'features' | 'integrations';

export interface DocGroup {
  slug: DocGroupSlug;
  title: string;
  summary: string;
}

export const DOC_GROUPS: DocGroup[] = [
  {
    slug: 'basics',
    title: 'Basics',
    summary: 'Get up and running, learn how a request URL is built, and adjust the config.',
  },
  {
    slug: 'features',
    title: 'Features',
    summary: 'Resize, crop, filter, and format images through the URL.',
  },
  {
    slug: 'integrations',
    title: 'Integrations',
    summary: 'Use picturium from PHP, JavaScript, or AI workflows.',
  },
];

// Standalone, not part of the three stages — a flat lookup section surfaced
// on its own so people can jump straight to the tables.
export const QUICK_REFERENCE = {
  slug: 'reference',
  title: 'Quick reference',
  summary: 'Look up URL parameters, configuration keys, and HTTP status codes.',
  pages: [
    {
      title: 'URL parameter index',
      slug: 'parameters',
      summary: 'Each query parameter, including its aliases, type, and default value.',
    },
    {
      title: 'Config key index',
      slug: 'config-keys',
      summary: 'Each config.toml key, its default, and its environment-variable name.',
    },
    {
      title: 'HTTP status codes',
      slug: 'status-codes',
      summary: '200, 304, 403, 404, 415, 500, 503 and what causes each.',
    },
  ],
} satisfies { slug: string; title: string; summary: string; pages: DocPage[] };

export interface DocCategory {
  group: DocGroupSlug;
  title: string;
  slug: string;
  summary: string;
  pages: DocPage[];
  comingSoon?: boolean;
}

export const DOCS_NAV: DocCategory[] = [
  {
    group: 'basics',
    title: 'Getting started',
    slug: 'getting-started',
    summary: 'Install picturium, start the server, and transform your first image.',
    pages: [
      {
        title: 'Overview',
        slug: 'overview',
        summary: 'See how a file path and URL parameters become a transformed, cached response.',
      },
      {
        title: 'Install & run',
        slug: 'install',
        summary: 'Install with Docker, Cargo, or a prebuilt binary, and review the tools needed for each source type.',
      },
      {
        title: 'The data directory',
        slug: 'data-directory',
        summary: 'Choose the root folder picturium can serve. Requests cannot access files outside it.',
        params: ['data.dir'],
      },
      {
        title: 'Your first request',
        slug: 'first-request',
        summary: 'The parts of a request URL, what comes back, and which response headers to check.',
      },
      {
        title: 'Supported formats',
        slug: 'formats',
        summary: 'Input: jpeg, png, tiff, webp, gif, heif, jxl, jp2k, ico, bmp, psd, raw, svg, eps/ai/cdr, pdf, office, video. Output: jpeg, webp, png, gif, avif, jxl, plus pdf/svg passthrough.',
      },
    ],
  },
  {
    group: 'basics',
    title: 'Request model',
    slug: 'request-model',
    summary: 'Learn how picturium reads, verifies, caches, and serves a request.',
    pages: [
      {
        title: 'URL grammar',
        slug: 'url-grammar',
        summary: 'The path selects a file, and the query string describes the transforms. Most parameters also have a short alias.',
      },
      {
        title: 'Signed URLs',
        slug: 'signatures',
        summary: 'Protect requests with an optional HMAC-SHA256 signature. URL signing is off by default.',
        params: ['token', 'security.signature_enabled', 'security.signature_secret'],
      },
      {
        title: 'Caching & force',
        slug: 'caching',
        summary: 'Learn how the memory and disk caches work, and how force=true regenerates and replaces a cached response.',
        params: ['force', 'cache', 'cache.memory', 'cache.disk', 'cache.cache_control'],
      },
      {
        title: 'HTTP caching',
        slug: 'http-caching',
        summary: 'Use ETag and Last-Modified validators, 304 responses, and format-aware Vary headers.',
        params: ['cache.cache_control'],
      },
      {
        title: 'Errors & fallback',
        slug: 'errors',
        summary: 'Understand common error responses and use fallback= when a source is missing.',
        params: ['fallback', 'original'],
      },
      {
        title: 'Health & capacity',
        slug: 'health',
        summary: 'Check worker and queue capacity with GET /health, and understand when the server returns 503.',
        params: ['server.workers', 'server.queue_size'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Sizing & layout',
    slug: 'sizing',
    summary: 'Fit an image into a requested box.',
    pages: [
      {
        title: 'Width, height, aspect ratio',
        slug: 'dimensions',
        summary: 'w / h in pixels; ar (auto, square, video, or a fraction like 16/10) fills in a missing axis or picks the largest fitting box.',
        params: ['w', 'h', 'ar'],
      },
      {
        title: 'Fit modes',
        slug: 'fit',
        summary: 'Choose whether an image crops, pads, or stretches to fill the requested size.',
        params: ['fit', 'image.fit'],
      },
      {
        title: 'Gravity',
        slug: 'gravity',
        summary: 'Choose which part of an image a crop keeps, or where a contained image sits on the canvas.',
        params: ['g', 'image.gravity'],
      },
      {
        title: 'Scaling: dpr, scale, upsize',
        slug: 'scaling',
        summary: 'dpr multiplies the requested box before processing, scale multiplies during. upsize allows output larger than the source.',
        params: ['dpr', 'scale', 'upsize', 'image.upsize'],
      },
      {
        title: 'Resampling',
        slug: 'resample',
        summary: 'nearest, linear, cubic, lanczos2, lanczos3.',
        params: ['resample', 'image.resample'],
      },
      {
        title: 'Padding & extend',
        slug: 'padding',
        summary: 'Add space around an image and choose how picturium fills it.',
        params: ['pad', 'extend', 'bg', 'image.extend'],
      },
      {
        title: 'Rotation',
        slug: 'rotation',
        summary: 'rot by 0/90/180/270 or named directions; autorot applies the EXIF orientation tag.',
        params: ['rot', 'autorot', 'image.auto_rotate'],
      },
      {
        title: 'Background colour',
        slug: 'background',
        summary: 'bg for padding and flattened transparency: transparent, hex, rgb/hsl/hwb/oklab/oklch, or a CSS colour name.',
        params: ['bg'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Cropping',
    slug: 'cropping',
    summary: 'Cut a region out of the source before sizing.',
    pages: [
      {
        title: 'The crop parameter',
        slug: 'crop',
        summary: 'crop=ar:auto|w:50|h:50|g:center|x:0|y:0 — at least one of w/h/ar. Applied to the original before w/h/ar/fit/pad; out-of-bounds areas are clamped.',
        params: ['crop', 'image.crop_gravity'],
      },
      {
        title: 'Smart crop',
        slug: 'smart-crop',
        summary: 'g=attention / g=entropy pick the region and ignore x/y.',
        params: ['crop.g'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Filters & effects',
    slug: 'filters',
    summary: 'Combine several colour and image adjustments in one filter= value.',
    pages: [
      {
        title: 'Tone & colour',
        slug: 'tone',
        summary: 'brightness, contrast, saturate, hue.',
        params: ['filter'],
      },
      {
        title: 'Presets',
        slug: 'presets',
        summary: 'grayscale, sepia, invert.',
        params: ['filter'],
      },
      {
        title: 'Blur, sharpen, pixelate',
        slug: 'blur-sharpen',
        summary: 'Gaussian blur, unsharp, pixelation.',
        params: ['filter'],
      },
      {
        title: 'Palette',
        slug: 'palette',
        summary: 'Reduce to a monochrome or duotone palette (max 2 colours).',
        params: ['filter'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Output format & quality',
    slug: 'output',
    summary: 'Choose an output format and balance image quality against file size.',
    pages: [
      {
        title: 'Format selection',
        slug: 'format',
        summary: 'Choose a format directly or let f=auto select one from the client\'s Accept header.',
        params: ['f', 'output.format_priority', 'output.enable_avif', 'output.enable_webp', 'output.enable_jxl'],
      },
      {
        title: 'Quality',
        slug: 'quality',
        summary: 'Set q to a named level or a number from 1 to 100, with format-aware defaults for different image sizes.',
        params: ['q', 'output.quality', 'output.quality_curves'],
      },
      {
        title: 'Encoder options',
        slug: 'encoders',
        summary: 'effort, bitdepth, subsampling, presets and other per-codec knobs for jpeg, webp, avif, jxl, png, gif.',
        params: ['output.encoder', 'output.high_bitdepth', 'output.cmyk'],
      },
      {
        title: 'Metadata',
        slug: 'metadata',
        summary: 'meta keeps none / icc / exif / xmp / iptc / other / gainmap / all in the output.',
        params: ['meta', 'output.metadata'],
      },
      {
        title: 'Output limits',
        slug: 'limits',
        summary: 'limit=dimension caps pixels (scaled down keeping ratio); limit=size caps bytes by re-encoding at lower quality until it fits.',
        params: ['limit', 'output.max_width', 'output.max_height', 'output.max_size', 'output.max_size_threshold', 'output.max_size_attempts', 'output.max_size_min_quality'],
      },
      {
        title: 'Delivery: download & original',
        slug: 'delivery',
        summary: 'Download with a chosen filename, or return the original source without transforms.',
        params: ['download', 'original'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Animation & video',
    slug: 'animation',
    summary: 'Keep, flatten, or adjust animated images and extract video frames or clips.',
    pages: [
      {
        title: 'Animated images',
        slug: 'animated-images',
        summary: 'Animated GIF/WebP, AVIF/HEIC sequences and multi-page TIFF keep their animation with no anim= at all. Only webp and gif output can carry it.',
        params: ['anim', 'output.max_animation_frames'],
      },
      {
        title: 'The anim parameter',
        slug: 'anim',
        summary: 'anim=frames:N|timing:ms|fps:R|loop:N|stride:N, and anim=off to flatten to the first frame.',
        params: ['anim'],
      },
      {
        title: 'Video frames & clips',
        slug: 'video',
        summary: 't / time extracts one frame by seconds or timecode (seeks to the nearest keyframe). With anim, t is the clip start and frames its length.',
        params: ['t', 'anim', 'video.default_time', 'video.animation_frames', 'video.animation_fps', 'video.max_animation_frames', 'video.extraction_timeout', 'video.animation_timeout'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Documents & vectors',
    slug: 'documents',
    summary: 'Render pages from PDF, SVG, Office, and vector-art files.',
    pages: [
      {
        title: 'Page selection',
        slug: 'pages',
        summary: 'page / pages takes comma-separated indices and ranges (1,4-7,9), max 1000. For animated sources the first value is the start frame; under f=pdf it selects the returned pages.',
        params: ['page', 'pages', 'thumb'],
      },
      {
        title: 'SVG',
        slug: 'svg',
        summary: 'style applies base64 CSS; dpi sets load resolution or (under f=pdf) the page scale. Guards against oversized files and loading local resources.',
        params: ['style', 'dpi', 'svg.unlimited', 'svg.load_dpi', 'svg.allow_local_resources'],
      },
      {
        title: 'PDF',
        slug: 'pdf',
        summary: 'f=pdf serves a PDF from a PDF, office, SVG or vector source; with pages it returns exactly those pages.',
        params: ['f', 'dpi', 'pdf.load_dpi'],
      },
      {
        title: 'Office documents',
        slug: 'office',
        summary: 'doc/ppt/xls are converted with LibreOffice first.',
        params: ['office.conversion_timeout'],
      },
      {
        title: 'Vector art',
        slug: 'vector',
        summary: 'ai, cdr/cmx/cdt and eps are converted with Inkscape (to SVG for f=svg, to PDF otherwise). Normally one page.',
        params: ['vector.conversion_timeout'],
      },
      {
        title: 'Serving non-image files',
        slug: 'passthrough',
        summary: 'Allow selected non-image file types to pass through unchanged instead of returning 415.',
        params: ['data.serve'],
      },
    ],
  },
  {
    group: 'features',
    title: 'Watermarking',
    slug: 'watermarking',
    summary: 'Overlay an image or text mark.',
    pages: [
      {
        title: 'watermark parameter',
        slug: 'watermark',
        summary: 'Build a watermark from an image or text. Images take priority, and watermark=false disables it for one request.',
        params: ['watermark'],
      },
      {
        title: 'Config defaults',
        slug: 'watermark-config',
        summary: 'With watermark.enabled every response is marked. image.path is operator-supplied (not confined to data.dir); a request image: path is. max_scale shrinks oversized marks.',
        params: ['watermark.enabled', 'watermark.position', 'watermark.opacity', 'watermark.padding', 'watermark.rotate', 'watermark.max_scale', 'watermark.image', 'watermark.text'],
      },
      {
        title: 'Behaviour',
        slug: 'watermark-behaviour',
        summary: 'Drawn on every frame and every document page; skipped for f=pdf, f=svg and original. dpr scales pad, scale and size.',
      },
    ],
  },
  {
    group: 'features',
    title: 'Video clipping',
    slug: 'video-clipping',
    summary: 'Extract a clip or frame from a video source.',
    pages: [],
    comingSoon: true,
  },
  {
    group: 'basics',
    title: 'Configuration & operations',
    slug: 'configuration',
    summary: 'Configure, deploy, monitor, and tune the server.',
    pages: [
      {
        title: 'Config file',
        slug: 'config-file',
        summary: 'Load config.toml, use built-in defaults, and catch unknown or invalid settings at startup.',
        params: ['PICTURIUM_CONFIG'],
      },
      {
        title: 'Environment overrides',
        slug: 'env-vars',
        summary: 'PICTURIUM__SECTION__KEY with __ between levels; list keys are comma-separated.',
      },
      {
        title: 'Cache tuning',
        slug: 'cache-ops',
        summary: 'Size the memory and disk caches and understand eviction and the cache-directory lock.',
        params: ['cache.memory', 'cache.disk', 'cache.dir'],
      },
      {
        title: 'Concurrency',
        slug: 'concurrency',
        summary: 'Tune workers, queue capacity, and libvips concurrency, and understand when requests receive 503.',
        params: ['server.workers', 'server.queue_size', 'vips.concurrency'],
      },
      {
        title: 'CORS & logging',
        slug: 'cors-logging',
        summary: 'cors.allowed_origins (["*"] = permissive), server.log_level, vips.debug.',
        params: ['cors.allowed_origins', 'server.log_level', 'vips.debug'],
      },
    ],
  },
  {
    group: 'integrations',
    title: 'PHP library',
    slug: 'php-library',
    summary: 'Use picturium in your PHP applications, including your favourite frameworks.',
    pages: [],
  },
  {
    group: 'integrations',
    title: 'JavaScript library',
    slug: 'javascript-library',
    summary: 'Use picturium in your JavaScript and TypeScript applications.',
    pages: [],
  },
  {
    group: 'integrations',
    title: 'AI integration',
    slug: 'ai-integration',
    summary: 'Automate picturium integration within your existing codebase.',
    pages: [],
    comingSoon: true,
  },
  {
    group: 'integrations',
    title: 'Monitoring & telemetry',
    slug: 'monitoring-telemetry',
    summary: 'Observe requests, performance, and service health.',
    pages: [],
    comingSoon: true,
  },
];
