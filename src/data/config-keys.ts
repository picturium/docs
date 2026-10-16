// Full config.toml reference. Source of truth: picturium2/config.toml.example
// plus the struct + validate() code in picturium2/src/config/*.rs.
export interface Group {
  id: string;
  title: string;
  blurb?: string;
  rows: [string, string, string, string][]; // key, type / values, default, what it does
}

export const groups: Group[] = [
  {
    id: 'server',
    title: '[server]',
    rows: [
      ['log_level', 'debug · info · warn · error', '"debug"', 'Controls log detail. RUST_LOG overrides this value when set.'],
      ['host', 'IP or hostname', '"0.0.0.0"', 'Address used by the HTTP listener. 0.0.0.0 accepts connections on every network interface.'],
      ['port', '1–65535', '20045', 'TCP port the listener binds to.'],
      ['workers', 'integer ≥ 0', '0', 'Maximum number of images rendered at once. 0 means twice the logical CPU count.'],
      ['queue_size', 'integer ≥ 0', '100', 'Maximum number of requests waiting for a worker. A full queue rejects new requests with 503.'],
    ],
  },
  {
    id: 'security',
    title: '[security]',
    rows: [
      ['signature_enabled', 'bool', 'false', 'Requires every request to include a valid HMAC token for its path and query. When false, requests do not need a signature.'],
      ['signature_secret', 'string', '""', 'Shared secret used for HMAC-SHA256 signatures. Generate one with openssl rand -hex 48. Used only when signature_enabled is true.'],
      ['health_token', 'string', '""', 'Bearer token that unlocks details on GET /health (version, worker and queue counts, memory statistics) when sent as Authorization: Bearer <token> or as ?token=<token>. The query form ends up in access logs, so prefer the header. Without a token /health returns only the status; a wrong token gets 401. Empty disables the details.'],
    ],
  },
  {
    id: 'cors',
    title: '[cors]',
    rows: [
      ['allowed_origins', 'list of origins', '["*"]', 'Origins allowed to read responses across origins. "*" allows all origins; otherwise each origin must match exactly. Invalid entries are ignored.'],
    ],
  },
  {
    id: 'vips',
    title: '[vips]',
    rows: [
      ['debug', 'bool', 'false', 'Turns on libvips leak checking and prints the objects still alive at shutdown. Diagnostics only; it adds overhead.'],
      ['concurrency', 'integer', '1', 'Threads libvips may use inside a single operation. Total threads ≈ server.workers × vips.concurrency.'],
    ],
  },
  {
    id: 'data',
    title: '[data]',
    rows: [
      ['dir', 'path', '"data"', 'Root folder for source files. Requests cannot access files outside it.'],
      ['serve', 'list of extensions', '[]', 'Non-image file extensions that picturium may return unchanged, such as "zip" or "txt". ["*"] allows every extension; unlisted types return 415.'],
    ],
  },
  {
    id: 'cache',
    title: '[cache]',
    blurb: 'Both cache tiers are enabled by default. picturium checks memory first, then disk. A result that fits neither is returned without being cached.',
    rows: [
      ['dir', 'path', '"cache"', 'Directory used by the disk cache. Only one running process can use it at a time.'],
      ['cache_control', 'header value', '"public, max-age=604800, must-revalidate"', 'Sent verbatim as Cache-Control on every successful response. A force=true response sends no-store instead.'],
      ['memory.enabled', 'bool', 'true', 'Enables the memory cache, which is checked before disk.'],
      ['memory.limit', 'MiB > 0', '256', 'Total memory budget for the memory tier. Each entry is charged its own size.'],
      ['memory.entry_limit', 'MiB > 0', '2', 'Largest single response kept in memory. Bigger renders fall through to disk, or are served uncached.'],
      ['disk.enabled', 'bool', 'true', 'Enables the disk cache and locks the cache directory for this process.'],
      ['disk.limit', 'MiB > 0', '1024', 'Effective on-disk capacity, shared by finished responses and Office / SVG / video intermediates. foyer evicts and reclaims automatically.'],
      ['disk.entry_limit', 'MiB > 0', '16', 'Largest single response written to disk. Also foyer\'s block size, the unit it reclaims in. Changing it discards the existing disk cache.'],
    ],
  },
  {
    id: 'svg',
    title: '[svg]',
    rows: [
      ['unlimited', 'bool', 'false', "Allow loading SVG files larger than libvips' 10 MB safety limit."],
      ['load_dpi', 'integer', '72', 'Resolution an SVG is rasterised at when the request gives no dpi.'],
      ['allow_local_resources', 'bool', 'false', 'Allows an SVG rendered as PDF (f=pdf) to embed files referenced by <image href>. References must stay inside the data directory; absolute paths and ".." are rejected. Keep this off when users should not read each other\'s files.'],
    ],
  },
  {
    id: 'pdf',
    title: '[pdf]',
    rows: [
      ['load_dpi', 'integer', '72', 'Resolution a PDF page is rasterised at when the request gives no dpi.'],
      ['background', 'colour, same syntax as bg', '"white"', 'Colour behind PDF and Office pages when they are rasterised. A bg parameter on the request wins. Must parse as a colour or startup fails.'],
      ['max_file_size', 'MiB', '256', 'PDFs larger than this are not rendered. The original file is served as-is instead, or the fallback is rendered when the request has one.'],
      ['max_pages', 'integer, 1–65535', '512', 'Most pages one request may select with page / pages. Larger selections get a 400, or the fallback when the request has one. Applies to PDF, Office and vector-art sources; animated images are not limited by it.'],
      ['max_image_pixels', 'megapixels', '64', 'Refuses to render a PDF when its first page, at the resolved render scale, would exceed this many pixels. The request fails with a 500, or renders the fallback when the request has one.'],
    ],
  },
  {
    id: 'office',
    title: '[office]',
    rows: [
      ['conversion_timeout', 'seconds', '30', 'How long LibreOffice may take to convert one document before the request fails.'],
      ['kill_timeout', 'seconds', '300', 'Hard limit for one LibreOffice run. A conversion that outlives conversion_timeout keeps going in the background to fill the cache until this limit kills it. Must not be lower than conversion_timeout.'],
      ['max_processes', 'integer ≥ 0', '0', 'Maximum number of LibreOffice processes running at once, background conversions included. Further conversions wait for a free slot. 0 means the logical CPU count.'],
    ],
  },
  {
    id: 'vector',
    title: '[vector]',
    rows: [
      ['conversion_timeout', 'seconds', '30', 'How long Inkscape may take to convert one .ai / .cdr / .cmx / .cdt / .eps / .dxf source before the request fails.'],
    ],
  },
  {
    id: 'video',
    title: '[video]',
    rows: [
      ['default_time', 'seconds or timecode', '"1"', 'Frame position used when the request does not set t. The one-second default avoids many black or fading first frames.'],
      ['extraction_timeout', 'seconds', '15', 'Time budget for pulling a single frame out of a video.'],
      ['animation_timeout', 'seconds', '60', 'Time limit for extracting a clip. Unlike a single-frame seek, a clip decodes every frame in its range.'],
      ['animation_frames', 'integer', '48', 'Frames sampled for a clip when anim gives no count.'],
      ['animation_fps', 'rate', '12', 'Sample rate for a clip when anim gives no timing or fps.'],
      ['max_animation_frames', 'integer', '300', 'Hard ceiling on frames in one clip, whatever anim=frames asks for.'],
    ],
  },
  {
    id: 'image',
    title: '[image]',
    blurb: 'Default sizing and layout values. Each value can be overridden by the matching URL parameter.',
    rows: [
      ['auto_rotate', 'bool', 'true', 'Apply the EXIF orientation tag so the image faces the right way. Request override: autorot.'],
      ['upsize', 'bool', 'false', 'Allows output larger than the source. When false, picturium shrinks the requested box to fit the original. Request override: upsize.'],
      ['extend', 'bg · copy · repeat · mirror', '"bg"', 'How area added by padding or aspect-ratio fill is filled. bg uses the background colour. Request override: extend.'],
      ['fit', 'cover · contain · force', '"cover"', 'Controls how the image fills the requested box: cover crops overflow, contain adds padding, and force stretches. Request override: fit.'],
      ['gravity', 'top · right · bottom · left · top-left · top-right · bottom-left · bottom-right · center · attention · entropy', '"center"', 'Chooses which part a cover crop keeps, or where a contained image sits. attention and entropy use libvips smart cropping. Request override: g.'],
      ['crop_gravity', 'top · right · bottom · left · top-left · top-right · bottom-left · bottom-right · center · attention · entropy', '"center"', 'Default gravity for the crop= parameter specifically — it does not inherit image.gravity.'],
      ['resample', 'nearest · linear · cubic · lanczos2 · lanczos3', '"lanczos3"', 'Resampling kernel used when scaling. Request override: resample.'],
    ],
  },
  {
    id: 'watermark',
    title: '[watermark]',
    blurb: 'Defaults for watermarks when enabled is true. Each key can be overridden with watermark=…, and watermark=false disables the mark for one request. An image takes priority over text.',
    rows: [
      ['enabled', 'bool', 'false', 'Adds a watermark to every supported response unless the request opts out. Set image.path or text.text before enabling it.'],
      ['position', 'center · repeat · top · right · bottom · left · top-left · top-right · bottom-left · bottom-right', '"bottom-right"', 'Where the mark sits. repeat tiles it across the image.'],
      ['opacity', '0–100', '50', 'Mark opacity, in percent.'],
      ['padding', '"10" · "10,20" · "10,20,30" · "10,20,30,40"', '"10,10,10,10"', 'CSS-like shorthand. Gap between the mark and the edge, and between tiles under position = "repeat".'],
      ['rotate', 'degrees', '0.0', 'Rotation of the mark, any angle.'],
      ['max_scale', '0–1', '1.0', 'Largest fraction of the image width and height the mark itself may cover. Padding can reduce the available space further.'],
      ['image.path', 'path', '""', 'Operator-supplied path to the watermark image. Not confined to the data directory, unlike a request-supplied watermark=image: path.'],
      ['image.scale', '> 0', '1.0', 'Scale factor applied to the watermark image.'],
      ['text.text', 'string', '""', 'Text drawn as the watermark when no image path is set.'],
      ['text.font_family', 'family name', '"Arial"', 'Font used for a text watermark.'],
      ['text.font_size', 'px', '12', 'Font size for a text watermark.'],
      ['text.font_color', 'colour, same syntax as bg', '"black"', 'Colour of a text watermark. Must parse as a colour or startup fails.'],
    ],
  },
  {
    id: 'output',
    title: '[output]',
    rows: [
      ['format_priority', 'ordered list', '["jxl", "avif", "webp", "jpeg", "png"]', "Order used by f=auto when checking the client's Accept header. It falls back to webp. gif is not selected automatically."],
      ['enable_avif', 'bool', 'true', 'Reserved; the current pipeline does not use this key to gate AVIF output.'],
      ['enable_webp', 'bool', 'true', 'Reserved; the current pipeline does not use this key to gate WebP output.'],
      ['enable_jxl', 'bool', 'true', 'Reserved; the current pipeline does not use this key to gate JPEG XL output.'],
      ['metadata', 'list: none · icc · exif · xmp · iptc · other · gainmap · all', '["none"]', 'Metadata blocks copied into the output. none strips everything. Request override: meta.'],
      ['quality', 'auto · low · medium · high · maximum · 1–100', '"medium"', 'Default quality. A named level shifts the per-format quality curve; a number is used directly. Request override: q.'],
      ['high_bitdepth', 'bool', 'false', 'Reserved; the current raster encoder pipeline does not read this key.'],
      ['cmyk', 'bool', 'false', 'Reserved; the current raster encoder pipeline does not read this key.'],
      ['max_width', 'px, 0 = unlimited', '5000', 'Maximum output width. Wider results are scaled down without changing their aspect ratio. Request override: limit=dimension.'],
      ['max_height', 'px, 0 = unlimited', '5000', 'Ceiling on output height.'],
      ['max_size', 'bytes, unit suffix ok ("500K", "2M"), "0" = unlimited', '"0"', 'Maximum output file size. picturium re-encodes the image at a lower quality until it fits. Request override: limit=size.'],
      ['max_size_threshold', 'percent', '10', 'How far under max_size counts as close enough — a result in that band is accepted without another recompress.'],
      ['max_size_attempts', 'integer', '3', 'Maximum recompress passes when chasing max_size.'],
      ['max_size_min_quality', '1–100', '10', 'Quality floor for the recompress search.'],
      ['max_animation_frames', 'integer, 0 = unlimited', '300', 'Hard cap on frames in one animated response. Each frame is a full pass through the geometry stages.'],
    ],
  },
];

// output.quality_curves — one row per format, shared column meanings.
export const curveCols = ['min', 'max', 'low', 'high', 'maximum'];
export const curves: [string, string, string, string, string, string][] = [
  ['jpeg', '32', '80', '−12', '10', '17'],
  ['webp', '40', '78', '−10', '8', '15'],
  ['avif', '38', '67', '−10', '10', '16'],
  ['png', '32', '99', '−30', '0', '1'],
  ['jxl', '66.667', '85.333', '−10', '4.467', '11.667'],
  ['gif', '50', '90', '−15', '6', '10'],
];

export const encoderRows: [string, string, string, string][] = [
  ['jpeg.optimize_coding', 'bool', 'true', 'Optimise Huffman tables — slower, slightly smaller. JPEG has no effort setting.'],
  ['webp.effort', '0–6', '2', 'Encode effort. Higher is slower and smaller.'],
  ['webp.text_preset_area', 'megapixels', '0.25', 'At or below this area the WebP encoder uses preset_small instead of preset_large.'],
  ['webp.preset_small', 'default · picture · photo · drawing · icon · text', '"text"', 'libwebp preset for images at or below text_preset_area.'],
  ['webp.preset_large', 'default · picture · photo · drawing · icon · text', '"default"', 'libwebp preset for larger images.'],
  ['webp.min_alpha_quality', '0–100', '75', 'Alpha is never encoded below this quality.'],
  ['webp.smart_subsample', 'bool', 'true', 'Still images only. Smarter chroma subsampling; skipped on animation where it is slower and larger.'],
  ['webp.animation_min_size', 'bool', 'false', 'Animation only. Try every frame encoding and keep the smallest file. Much slower.'],
  ['webp.animation_kmin', '≥ 0', '0', 'Animation only. Smallest gap between keyframes. 0 lets libwebp place none.'],
  ['webp.animation_kmax', '≥ animation_kmin', '0', 'Animation only. Largest gap between keyframes. Closer keyframes seek better but cost encode time and size.'],
  ['png.effort', '1–10', '2', 'Encode effort.'],
  ['png.lossless_quality', '1–100', '100', 'Quality at or above which PNG switches to the lossless (non-palette) branch.'],
  ['png.compression', '0–9', '2', 'Deflate level for the palette branch.'],
  ['png.lossless_compression', '0–9', '3', 'Deflate level for the lossless branch.'],
  ['png.dither', '0–1', '0.25', 'Quantisation dithering for the palette branch.'],
  ['png.lossless_dither', '0–1', '0.0', 'Quantisation dithering for the lossless branch.'],
  ['avif.effort', '0–9', '1', 'Encode effort.'],
  ['avif.bitdepth', '8 · 10 · 12', '8', 'Bits per channel.'],
  ['avif.compression', 'av1 · hevc · avc · jpeg', '"av1"', 'Codec carried in the AVIF container.'],
  ['avif.encoder', 'aom · auto · rav1e · svt · x265', '"aom"', 'Which encoder implementation to use.'],
  ['avif.subsample', 'auto · on · off', '"on"', 'Chroma subsampling.'],
  ['jxl.effort', '1–9', '3', 'Encode effort.'],
  ['jxl.tier', '0–4', '0', 'Decode-speed tier. Higher decodes faster and compresses worse.'],
  ['jxl.lossless', 'bool', 'false', 'Force lossless JXL.'],
  ['jxl.distance_per_quality', '> 0', '0.15', 'Converts the shared 1–100 quality to a JXL distance: distance = distance_per_quality × (100 − q).'],
  ['gif.effort', '1–10', '7', 'Encode effort.'],
  ['gif.bitdepth', '1–8', '8', 'Palette at quality 100 is 2^bitdepth colours.'],
  ['gif.min_bitdepth', '1 – bitdepth', '5', 'Palette bit depth at quality 1, interpolated up to bitdepth across the quality range.'],
  ['gif.dither', '0–1', '1.0', 'Quantisation dithering at quality 100.'],
  ['gif.min_dither', '0 – dither', '0.6', 'Quantisation dithering at quality 1.'],
  ['gif.interframe_maxerror', '0–32', '8.0', 'Animation only. At quality 1 (0 at quality 100), pixels that changed less than this are reused from the previous frame.'],
  ['gif.interpalette_maxerror', '0–256', '20.0', 'Animation only. At quality 1 (0 at quality 100), above this a frame reuses the previous frame’s palette.'],
];

// the MDX page writes its own headings (so the TOC can pick them up) and pulls
// the matching rows by id
export const rows = (id: string) => groups.find((g) => g.id === id)!.rows;
