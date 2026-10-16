// Quick reference tables. Source of truth: picturium2/url_params.md and
// picturium2/config.toml.example.
// Rows are [names, values, default, note, more?]. names and values are
// ' · '-separated lists; a values list with more than one entry renders as pills.
// more links the name to a fuller section instead of the row's own anchor.
export type Row = [string, string, string, string?, string?];

// Grouped by what the parameter changes; reference.mdx gives each group a heading.
export const params: Record<string, Row[]> = {
  size: [
    ['w · width', 'int (px)', '0 = auto', 'Output width. If you set only w or h, picturium calculates the other dimension from the source ratio or ar.'],
    ['h · height', 'int (px)', '0 = auto', 'Output height. A value of 0 or an empty value means no height was requested.'],
    ['ar · aspect_ratio', 'auto · square · video · fraction (16/10)', 'auto', 'Custom ratio must be a fraction — ar=1 is rejected, ar=1/1 is not. Ignored when both w and h are set.'],
    ['fit', 'cover · contain · force', 'cover', 'cover crops overflow, contain adds padding, and force stretches the image.'],
    ['g · gravity', 'top · right · bottom · left · top-left · top-right · bottom-left · bottom-right · center · attention · entropy', 'center', 'Chooses which part a cover crop keeps, or where a contained image sits. attention and entropy use smart cropping; animated sources use center.'],
    ['dpr', 'float ≥ 1', '1', 'Multiplies w and h before processing.'],
    ['scale', 'float > 0', '1', 'Multiplies w and h during processing.'],
    ['upsize', 'bool', 'false', 'Allows the output to be larger than the source. SVG, PDF, Office and vector sources default to true.'],
    ['resample', 'nearest · linear · cubic · lanczos2 · lanczos3', 'lanczos3', 'Resampling kernel.'],
  ],
  canvas: [
    ['pad · padding', 'N · v,h · t,r,b · t,r,b,l', '0', 'Adds space around the image. extend controls how that space is filled.'],
    ['extend', 'bg · copy · repeat · mirror', 'bg', 'How padding / aspect-ratio fill is filled.'],
    ['bg · background', 'transparent · hex (no #) · rgb/hsl/hwb/oklab/oklch · CSS name', 'transparent', 'Colour for padding and flattened transparency.'],
    ['rot · rotate', 'no · 0 · 90 · 180 · 270 · left · right · bottom-up · clockwise · anticlockwise', 'no', 'Rotate by a fixed step or named direction.'],
    ['autorot · auto_rotate', 'bool', 'true', 'Applies the EXIF orientation tag.'],
  ],
  output: [
    ['f · format', 'auto · jpg · png · webp · gif · avif · jxl · pdf · svg', 'auto', 'auto uses the Accept header and format priority, then falls back to webp. It never selects gif automatically. pdf and svg pass through supported documents.'],
    ['q · quality', 'auto · low · medium · high · maximum · 1–100', 'medium', 'Sets output quality using the selected format\'s quality curve.'],
    ['meta · metadata', 'none · icc · exif · xmp · iptc · other · gainmap · all', 'none', 'Keep several metadata types by separating them with commas, for example meta=icc,exif.'],
    ['download', 'filename', 'resolved output name', 'Downloads the response as an attachment. The filename does not select or override f.'],
  ],
  documents: [
    ['dpi', 'auto · 1–3000', 'svg.load_dpi / pdf.load_dpi (72)', 'Resolution used to rasterise SVG, PDF, Office and vector sources. Under f=pdf with an SVG source it sets the page scale instead.'],
    ['style', 'base64 CSS', '—', 'Extra CSS applied to an SVG source (and to f=pdf from SVG).'],
    ['page · pages', '1 · 1,2,3 · 1,4-7,9', '1', 'Selects up to pdf.max_pages (512) document pages. For animation, the first value selects the starting frame. For video, use t instead.'],
    ['t · time', 'seconds (5, 5.25) · timecode (00:01:30)', 'video.default_time', 'The only way to address a video frame. Seeks to the nearest keyframe.'],
  ],
  grouped: [
    ['crop', 'crop=w:50|h:50|ar:auto|g:center|x:0|y:0', '—', 'Cut a region from the original before w / h / ar / fit / pad.', '#crop'],
    ['filter', 'filter=brightness:1.1|contrast:1.2|blur:2', '—', 'Image effects, applied left to right and combined with |.', '#filter'],
    ['anim · animate', 'anim=frames:10|fps:12|loop:0 · anim=off', '—', 'Control an animation / extract a video clip.', '#anim--animate'],
    ['watermark', 'watermark=image:mark.png|opacity:50 · watermark=false', 'config', 'Overlay an image or text mark.', '#watermark'],
    ['limit · limits', 'limit=dimension:800x600|size:2M', 'config', 'Cap output pixels or bytes.', '#limit--limits'],
  ],
  delivery: [
    ['original', 'bool', 'false', 'Returns the source unchanged, without transforms or a watermark.'],
    ['force', 'bool', 'false', 'Skips cached responses, regenerates the file, and replaces the cache entry. The response uses Cache-Control: no-store and never returns 304.'],
    ['cache', 'any string', '—', 'Changes the browser or CDN cache key without changing the server cache key.'],
    ['fallback', 'path under data.dir', '—', 'Uses another source when the requested source is missing, or when a PDF exceeds a pdf.max_* limit. It does not catch other processing failures.'],
    ['token', 'hex HMAC-SHA256', '—', 'Required only when signature verification is enabled. Signed over "path?query" with token= removed.'],
  ],
};

export const crop: Row[] = [
  ['w · width', 'int (px of original)', '0'],
  ['h · height', 'int (px of original)', '0'],
  ['ar · aspect_ratio', 'ratio', 'auto'],
  ['g · gravity', 'top · right · bottom · left · top-left · top-right · bottom-left · bottom-right · center · attention · entropy', 'center (image.crop_gravity)'],
  ['x', 'int (px from gravity, ± ok)', '0'],
  ['y', 'int (px from gravity, ± ok)', '0'],
];

export const filter: Row[] = [
  ['brightness', 'float (~0–5)', '1'],
  ['contrast', 'float (~0–5)', '1'],
  ['saturate', 'float (~0–5)', '1'],
  ['hue', 'float (deg, 0–360)', '0'],
  ['grayscale', 'float (0–1)', '0'],
  ['sepia', 'float (0–1)', '0'],
  ['invert', 'float (0–1)', '0'],
  ['blur', 'integer (0–n)', '0'],
  ['sharpen', 'float (0–10)', '0'],
  ['pixelate', 'integer (1–n)', '1'],
  ['palette', '1–2 colours[, intensity]', '—', 'Gives a monochrome / duotone look.'],
];

export const anim: Row[] = [
  ['frames', 'int', 'every frame', 'Counts from the frame selected by page, up to output.max_animation_frames (300 by default).'],
  ['timing', 'int (ms, 5–5000)', 'source delays / 100', 'Replaces the source frame delay.'],
  ['fps', 'float', '—', 'Same control as a rate. Cannot be combined with timing.'],
  ['loop', 'int (0 = forever)', 'source loop count', ''],
  ['stride', 'int (≥ 1)', '1', 'Keeps every Nth frame.'],
];

export const watermark: Row[] = [
  ['image', 'path under the data dir', 'watermark.image.path', 'Takes priority over text at the same level; request values take priority over configured sources.'],
  ['text', 'string', 'watermark.text.text', 'Used when no image is given.'],
  ['anchor', 'center · repeat · top · right · bottom · left · top-left · top-right · bottom-left · bottom-right', 'bottom-right', ''],
  ['opacity', 'int 0–100', '50', ''],
  ['pad · padding', 'px / CSS-like shorthand', 'config', 'Also the gap between tiles under anchor:repeat.'],
  ['rot · rotate', 'float (deg)', '0', ''],
  ['scale', 'float', '1', 'Image mark only.'],
  ['font', 'family', 'Arial', 'Text mark only.'],
  ['size', 'int (px)', '12', 'Text mark only.'],
  ['color', 'like bg', 'black', 'Text mark only.'],
];

export const limit: Row[] = [
  ['dimension', 'N · WxH · xH · Wx', 'output.max_width / max_height (5000, 0 = unlimited)', 'Scales down while preserving the aspect ratio.'],
  ['size', 'bytes · 500K · 2M · 1.5MiB', 'output.max_size (0 = unlimited)', 'Re-encodes at a lower quality until the file fits.'],
];

export const status = [
  ['200', 'OK', 'Returns the transformed file or an allowed passthrough file.'],
  ['304', 'Not Modified', 'A client validator (ETag / If-Modified-Since) matched. Never returned with force=true.'],
  ['400', 'Bad Request', 'A known query parameter is invalid, or a page selection lands on no existing page.'],
  ['403', 'Forbidden', 'Signature verification is on and token is missing or wrong.'],
  ['404', 'Not Found', 'The source file was not found inside the data directory.'],
  ['415', 'Unsupported Media Type', 'The source cannot be processed and its extension is not in data.serve — or f=pdf / f=svg was asked for a source that cannot produce one.'],
  ['500', 'Internal Server Error', 'Processing, conversion, or encoding failed, for example because t is past the end of a video.'],
  ['503', 'Service Unavailable', 'The request queue is full.'],
];

// Input formats by family; output is split by what the format can hold.
export const inputFormats: [string, string[]][] = [
  ['Photos', ['jpeg', 'png', 'tiff', 'webp', 'gif', 'heif · heic · avif', 'jxl', 'jp2k', 'ico', 'bmp']],
  ['Design & vector', ['psd', 'svg · svgz', 'eps', 'ai', 'cdr · cmx · cdt', 'dxf']],
  ['Documents', ['pdf', 'doc', 'docx', 'odt', 'rtf', 'ppt', 'pptx', 'odp', 'xls', 'xlsx', 'ods', 'csv', '+ macro & template variants']],
  ['Camera RAW', ['raf', 'rw2', 'pef', 'orf', 'nrw', 'nef', 'dng', 'cr2', 'cr3', 'crw', 'arw']],
  ['Video', ['mp4', 'webm', 'mkv', 'avi', 'av1', '3gp', 'm4v', 'flv', 'mov', 'mpeg', 'mts', 'hevc']],
];
export const outputFormats: [string, string[]][] = [
  ['Images', ['jpeg', 'webp', 'png', 'gif', 'avif', 'jxl']],
  ['Animated', ['webp', 'gif']],
  ['Documents', ['pdf', 'svg']],
];
