import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All 200 tools data
const tools = [
  // FILE & IMAGE TOOLS
  { id: "jpg-to-png", name: "JPG to PNG Converter", category: "File & Image", keywords: ["jpg to png", "convert jpg", "image converter", "png transparency", "photo format"] },
  { id: "png-to-jpg", name: "PNG to JPG Converter", category: "File & Image", keywords: ["png to jpg", "compress png", "image conversion", "reduce file size", "photo converter"] },
  { id: "webp-to-jpg", name: "WebP to JPG Converter", category: "File & Image", keywords: ["webp to jpg", "webp converter", "google webp", "image format", "web images"] },
  { id: "webp-to-png", name: "WebP to PNG Converter", category: "File & Image", keywords: ["webp to png", "convert webp", "png format", "transparency", "image editing"] },
  { id: "heic-to-jpg", name: "HEIC to JPG Converter", category: "File & Image", keywords: ["heic to jpg", "iphone photos", "apple heic", "ios converter", "photo transfer"] },
  { id: "heic-to-png", name: "HEIC to PNG Converter", category: "File & Image", keywords: ["heic to png", "iphone heic", "apple photos", "high quality", "transparent"] },
  { id: "image-to-pdf", name: "Image to PDF Converter", category: "File & Image", keywords: ["image to pdf", "photo to pdf", "create pdf", "document maker", "pdf creator"] },
  { id: "pdf-to-image", name: "PDF to Image Converter", category: "File & Image", keywords: ["pdf to image", "pdf to jpg", "extract images", "pdf converter", "document images"] },
  { id: "pdf-compressor", name: "PDF Compressor", category: "File & Image", keywords: ["compress pdf", "reduce pdf size", "pdf optimizer", "small pdf", "pdf shrink"] },
  { id: "pdf-merger", name: "PDF Merger", category: "File & Image", keywords: ["merge pdf", "combine pdf", "join pdfs", "pdf joiner", "document merger"] },
  { id: "pdf-splitter", name: "PDF Splitter", category: "File & Image", keywords: ["split pdf", "pdf separator", "extract pages", "pdf divider", "page splitter"] },
  { id: "pdf-unlocker", name: "PDF Unlocker", category: "File & Image", keywords: ["unlock pdf", "remove password", "pdf password", "decrypt pdf", "open locked pdf"] },
  { id: "pdf-protect", name: "PDF Protect", category: "File & Image", keywords: ["protect pdf", "pdf password", "encrypt pdf", "secure pdf", "pdf security"] },
  { id: "pdf-metadata", name: "PDF Metadata Editor", category: "File & Image", keywords: ["pdf metadata", "edit pdf info", "pdf properties", "document info", "pdf tags"] },
  { id: "image-compressor", name: "Image Compressor", category: "File & Image", keywords: ["compress image", "reduce image size", "optimize images", "web optimization", "photo compressor"] },
  { id: "image-resizer", name: "Image Resizer", category: "File & Image", keywords: ["resize image", "change dimensions", "photo resizer", "scale image", "image dimensions"] },
  { id: "image-cropper", name: "Image Cropper", category: "File & Image", keywords: ["crop image", "trim photo", "cut image", "image editor", "photo crop"] },
  { id: "image-rotator", name: "Image Rotator", category: "File & Image", keywords: ["rotate image", "turn photo", "flip image", "image angle", "photo orientation"] },
  { id: "image-flipper", name: "Image Flipper", category: "File & Image", keywords: ["flip image", "mirror photo", "horizontal flip", "vertical flip", "photo mirror"] },
  { id: "color-picker", name: "Image Color Picker", category: "File & Image", keywords: ["color picker", "extract color", "eyedropper", "hex color", "rgb picker"] },
  { id: "background-remover", name: "Image Background Remover", category: "File & Image", keywords: ["remove background", "transparent background", "cutout", "photo editing", "ai background"] },
  { id: "image-blur", name: "Image Blur Tool", category: "File & Image", keywords: ["blur image", "photo blur", "gaussian blur", "blur effect", "image effects"] },
  { id: "image-sharpen", name: "Image Sharpen Tool", category: "File & Image", keywords: ["sharpen image", "enhance photo", "image clarity", "photo sharpening", "detail enhancement"] },
  { id: "image-filter", name: "Image Filter Editor", category: "File & Image", keywords: ["image filters", "photo effects", "instagram filters", "color filters", "vintage effects"] },
  { id: "merge-images", name: "Merge Images", category: "File & Image", keywords: ["merge images", "combine photos", "photo collage", "image joiner", "side by side"] },
  { id: "ocr-extract", name: "Extract Text (OCR)", category: "File & Image", keywords: ["ocr", "extract text", "image to text", "text recognition", "scan document"] },
  { id: "svg-to-png", name: "SVG to PNG Converter", category: "File & Image", keywords: ["svg to png", "vector to raster", "svg converter", "convert svg", "png export"] },
  { id: "png-to-svg", name: "PNG to SVG Converter", category: "File & Image", keywords: ["png to svg", "vectorize image", "trace image", "svg creator", "vector conversion"] },
  { id: "ico-to-png", name: "ICO to PNG Converter", category: "File & Image", keywords: ["ico to png", "icon converter", "favicon", "windows icon", "icon extractor"] },
  { id: "bmp-to-jpg", name: "BMP to JPG Converter", category: "File & Image", keywords: ["bmp to jpg", "bitmap converter", "bmp to jpeg", "image format", "compress bmp"] },
  { id: "raw-to-jpg", name: "RAW to JPG Converter", category: "File & Image", keywords: ["raw to jpg", "camera raw", "nef converter", "cr2 to jpg", "raw processing"] },
  { id: "watermark-image", name: "Watermark Image", category: "File & Image", keywords: ["watermark", "add watermark", "photo watermark", "protect images", "copyright"] },
  { id: "remove-watermark", name: "Remove Watermark", category: "File & Image", keywords: ["remove watermark", "watermark remover", "clean image", "ai removal", "photo restore"] },
  { id: "meme-generator", name: "Meme Generator", category: "File & Image", keywords: ["meme generator", "create meme", "meme maker", "funny images", "viral memes"] },
  { id: "image-annotation", name: "Image Annotation Tool", category: "File & Image", keywords: ["annotate image", "add text", "draw on image", "arrows", "image markup"] },
  { id: "sticker-maker", name: "Image Sticker Maker", category: "File & Image", keywords: ["sticker maker", "create sticker", "whatsapp sticker", "telegram sticker", "custom sticker"] },
  { id: "ai-cartoonizer", name: "AI Cartoonizer", category: "File & Image", keywords: ["cartoonize", "cartoon effect", "ai cartoon", "photo to cartoon", "anime style"] },
  { id: "pixel-art", name: "Pixel Art Converter", category: "File & Image", keywords: ["pixel art", "pixelate", "8bit art", "retro style", "game graphics"] },
  { id: "color-palette", name: "Color Palette Extractor", category: "File & Image", keywords: ["color palette", "extract colors", "color scheme", "design colors", "palette generator"] },
  { id: "gradient-generator", name: "Gradient Generator", category: "File & Image", keywords: ["gradient generator", "css gradient", "color gradient", "background gradient", "gradient maker"] },
  { id: "favicon-generator", name: "Favicon Generator", category: "File & Image", keywords: ["favicon generator", "website icon", "ico generator", "browser icon", "site favicon"] },
  { id: "transparent-png", name: "Transparent PNG Maker", category: "File & Image", keywords: ["transparent png", "remove bg", "alpha channel", "transparent image", "png transparency"] },
  { id: "noise-reducer", name: "Image Noise Reducer", category: "File & Image", keywords: ["noise reduction", "denoise", "photo cleanup", "grain removal", "image clarity"] },
  { id: "hdr-enhancer", name: "Image HDR Enhancer", category: "File & Image", keywords: ["hdr effect", "high dynamic range", "photo enhancement", "vibrant colors", "hdr photography"] },
  { id: "background-blur", name: "Background Blur Tool", category: "File & Image", keywords: ["background blur", "portrait mode", "bokeh effect", "depth blur", "focus effect"] },
  
  // AUDIO TOOLS
  { id: "audio-cutter", name: "Audio Cutter", category: "Audio", keywords: ["audio cutter", "cut audio", "trim audio", "mp3 cutter", "audio editor"] },
  { id: "audio-joiner", name: "Audio Joiner", category: "Audio", keywords: ["audio joiner", "merge audio", "combine mp3", "audio merger", "concatenate audio"] },
  { id: "mp3-converter", name: "MP3 Converter", category: "Audio", keywords: ["mp3 converter", "audio converter", "wav to mp3", "ogg to mp3", "convert audio"] },
  { id: "audio-speed", name: "Audio Speed Changer", category: "Audio", keywords: ["audio speed", "change tempo", "speed up audio", "slow down audio", "playback speed"] },
  { id: "volume-booster", name: "MP3 Volume Booster", category: "Audio", keywords: ["volume booster", "increase volume", "louder audio", "mp3 amplifier", "audio gain"] },
  { id: "audio-compressor", name: "Audio Compressor", category: "Audio", keywords: ["audio compressor", "compress audio", "reduce audio size", "mp3 compressor", "audio optimizer"] },
  { id: "audio-normalizer", name: "Audio Normalizer", category: "Audio", keywords: ["audio normalizer", "normalize volume", "level audio", "consistent volume", "audio leveling"] },
  { id: "noise-removal", name: "Noise Removal from Audio", category: "Audio", keywords: ["noise removal", "remove background noise", "clean audio", "denoise audio", "audio cleanup"] },
  { id: "audio-equalizer", name: "Audio Equalizer", category: "Audio", keywords: ["audio equalizer", "eq settings", "frequency adjustment", "bass boost", "treble"] },
  { id: "audio-reverser", name: "Audio Reverser", category: "Audio", keywords: ["reverse audio", "backwards audio", "audio reverser", "reversed sound", "flip audio"] },
  { id: "remove-vocals", name: "Remove Vocals", category: "Audio", keywords: ["remove vocals", "karaoke maker", "instrumental", "vocal remover", "music separation"] },
  { id: "extract-vocals", name: "Extract Vocals", category: "Audio", keywords: ["extract vocals", "isolate vocals", "vocal extraction", "acapella", "voice isolation"] },
  { id: "video-to-mp3", name: "Convert Video to MP3", category: "Audio", keywords: ["video to mp3", "extract audio", "youtube to mp3", "audio extraction", "video converter"] },
  { id: "text-to-speech", name: "Text to Speech", category: "Audio", keywords: ["text to speech", "tts", "voice generator", "ai voice", "read aloud"] },
  { id: "speech-to-text", name: "Speech to Text", category: "Audio", keywords: ["speech to text", "transcription", "voice to text", "audio transcribe", "dictation"] },
  { id: "pitch-changer", name: "Audio Pitch Changer", category: "Audio", keywords: ["pitch changer", "change pitch", "pitch shifter", "audio pitch", "voice changer"] },
  { id: "audio-trimmer", name: "Audio Trimmer", category: "Audio", keywords: ["audio trimmer", "trim mp3", "cut ends", "audio editor", "clip audio"] },
  { id: "audio-fade", name: "Audio Fade In/Out", category: "Audio", keywords: ["audio fade", "fade in", "fade out", "audio transition", "smooth audio"] },
  { id: "audio-loop", name: "Audio Loop Maker", category: "Audio", keywords: ["audio loop", "loop maker", "seamless loop", "repeat audio", "loop creator"] },
  { id: "audio-splitter", name: "Audio Splitter", category: "Audio", keywords: ["audio splitter", "split audio", "divide audio", "audio separator", "cut audio parts"] },
  { id: "waveform-visualizer", name: "Audio Waveform Visualizer", category: "Audio", keywords: ["waveform", "audio visualization", "sound wave", "audio visual", "spectrum analyzer"] },
  { id: "audio-metadata", name: "Audio Metadata Editor", category: "Audio", keywords: ["audio metadata", "id3 tags", "mp3 tags", "edit metadata", "audio info"] },
  { id: "ringtone-cutter", name: "Ringtone Cutter", category: "Audio", keywords: ["ringtone cutter", "create ringtone", "phone ringtone", "custom ringtone", "ringtone maker"] },
  { id: "merge-mp3", name: "Merge MP3 Files", category: "Audio", keywords: ["merge mp3", "combine mp3", "mp3 joiner", "concatenate mp3", "audio merge"] },
  { id: "remove-silence", name: "Remove Silence from Audio", category: "Audio", keywords: ["remove silence", "trim silence", "audio cleanup", "silent parts", "compact audio"] },
  { id: "mp3-tag-editor", name: "MP3 Tag Editor", category: "Audio", keywords: ["mp3 tag editor", "id3 editor", "music tags", "album art", "song info"] },
  { id: "audio-recorder", name: "Audio Recorder", category: "Audio", keywords: ["audio recorder", "voice recorder", "record audio", "microphone recorder", "online recorder"] },
  { id: "frequency-detector", name: "Sound Frequency Detector", category: "Audio", keywords: ["frequency detector", "pitch detector", "hz meter", "audio frequency", "tone detector"] },
  { id: "noise-meter", name: "Noise Meter Tool", category: "Audio", keywords: ["noise meter", "decibel meter", "sound level", "db meter", "noise measurement"] },
  { id: "white-noise", name: "White Noise Generator", category: "Audio", keywords: ["white noise", "pink noise", "brown noise", "sleep sounds", "ambient noise"] },
  
  // VIDEO TOOLS
  { id: "video-compressor", name: "Video Compressor", category: "Video", keywords: ["video compressor", "compress video", "reduce video size", "smaller video", "video optimizer"] },
  { id: "video-cutter", name: "Video Cutter", category: "Video", keywords: ["video cutter", "cut video", "trim video", "video editor", "clip video"] },
  { id: "video-trimmer", name: "Video Trimmer", category: "Video", keywords: ["video trimmer", "trim ends", "cut video", "shorten video", "video clipper"] },
  { id: "video-joiner", name: "Video Joiner", category: "Video", keywords: ["video joiner", "merge videos", "combine videos", "video merger", "join clips"] },
  { id: "video-resizer", name: "Video Resize Tool", category: "Video", keywords: ["video resizer", "resize video", "change resolution", "video dimensions", "scale video"] },
  { id: "video-cropper", name: "Video Cropper", category: "Video", keywords: ["video cropper", "crop video", "trim edges", "video frame", "aspect ratio"] },
  { id: "video-rotator", name: "Video Rotator", category: "Video", keywords: ["video rotator", "rotate video", "turn video", "video orientation", "flip video"] },
  { id: "video-flipper", name: "Video Flipper", category: "Video", keywords: ["video flipper", "flip video", "mirror video", "horizontal flip", "vertical flip"] },
  { id: "video-stabilizer", name: "Video Stabilizer", category: "Video", keywords: ["video stabilizer", "stabilize video", "reduce shake", "smooth video", "anti-shake"] },
  { id: "video-to-gif", name: "Video to GIF Converter", category: "Video", keywords: ["video to gif", "gif maker", "create gif", "animated gif", "gif converter"] },
  { id: "video-speed", name: "Video Speed Changer", category: "Video", keywords: ["video speed", "change speed", "fast forward", "slow motion", "playback speed"] },
  { id: "slow-motion", name: "Slow Motion Video", category: "Video", keywords: ["slow motion", "slow mo", "slow video", "time stretch", "slow playback"] },
  { id: "fast-motion", name: "Fast Motion Video", category: "Video", keywords: ["fast motion", "speed up video", "time lapse", "fast forward", "quick video"] },
  { id: "mute-video", name: "Mute Video", category: "Video", keywords: ["mute video", "remove audio", "silent video", "no sound", "audio removal"] },
  { id: "extract-audio", name: "Extract Audio from Video", category: "Video", keywords: ["extract audio", "video to audio", "rip audio", "audio extraction", "get soundtrack"] },
  { id: "extract-frames", name: "Extract Frames", category: "Video", keywords: ["extract frames", "video frames", "frame grabber", "screenshot video", "capture frames"] },
  { id: "gif-to-mp4", name: "GIF to MP4 Converter", category: "Video", keywords: ["gif to mp4", "gif to video", "convert gif", "animated to video", "gif converter"] },
  { id: "add-watermark-video", name: "Add Watermark to Video", category: "Video", keywords: ["video watermark", "add watermark", "video branding", "logo overlay", "protect video"] },
  { id: "remove-watermark-video", name: "Remove Video Watermark", category: "Video", keywords: ["remove watermark", "watermark remover", "clean video", "ai removal", "video cleanup"] },
  { id: "add-subtitles", name: "Add Subtitles to Video", category: "Video", keywords: ["add subtitles", "video captions", "subtitle editor", "srt", "closed captions"] },
  { id: "subtitle-embedder", name: "Subtitle to Video Embedder", category: "Video", keywords: ["embed subtitles", "hardcode subs", "burn subtitles", "permanent captions", "srt to video"] },
  { id: "mov-to-mp4", name: "Convert MOV to MP4", category: "Video", keywords: ["mov to mp4", "quicktime converter", "convert mov", "apple video", "iphone video"] },
  { id: "avi-to-mp4", name: "Convert AVI to MP4", category: "Video", keywords: ["avi to mp4", "avi converter", "convert avi", "video format", "mp4 converter"] },
  { id: "mkv-to-mp4", name: "Convert MKV to MP4", category: "Video", keywords: ["mkv to mp4", "mkv converter", "convert mkv", "matroska", "video conversion"] },
  { id: "video-brightness", name: "Video Brightness Tool", category: "Video", keywords: ["video brightness", "brighten video", "dark video fix", "exposure", "lighting"] },
  { id: "video-contrast", name: "Video Contrast Tool", category: "Video", keywords: ["video contrast", "adjust contrast", "video enhancement", "color correction", "visual depth"] },
  { id: "video-saturation", name: "Video Saturation Tool", category: "Video", keywords: ["video saturation", "color intensity", "vibrant colors", "desaturate", "color boost"] },
  { id: "video-color-grading", name: "Video Color Grading", category: "Video", keywords: ["color grading", "video lut", "cinematic look", "color correction", "video mood"] },
  { id: "reverse-video", name: "Reverse Video", category: "Video", keywords: ["reverse video", "backwards video", "video reverser", "rewind effect", "flip playback"] },
  { id: "boomerang-video", name: "Boomerang Video Maker", category: "Video", keywords: ["boomerang", "loop video", "instagram boomerang", "gif loop", "back and forth"] },
  { id: "merge-video-audio", name: "Merge Video + Audio", category: "Video", keywords: ["merge video audio", "add music", "combine tracks", "video with audio", "audio overlay"] },
  { id: "aspect-ratio", name: "Aspect Ratio Changer", category: "Video", keywords: ["aspect ratio", "video ratio", "16:9", "4:3", "widescreen"] },
  { id: "thumbnail-generator", name: "Video Thumbnail Generator", category: "Video", keywords: ["thumbnail generator", "video thumbnail", "youtube thumbnail", "preview image", "video cover"] },
  { id: "frame-rate", name: "Video Frame Rate Changer", category: "Video", keywords: ["frame rate", "fps changer", "video fps", "60fps", "smooth video"] },
  { id: "remove-bg-video", name: "Remove Background from Video", category: "Video", keywords: ["remove video background", "green screen", "video cutout", "ai background", "transparent video"] },
  { id: "add-bg-video", name: "Add Background to Video", category: "Video", keywords: ["add background", "video background", "virtual background", "replace background", "custom backdrop"] },
  { id: "video-watermark-text", name: "Video Watermark Text", category: "Video", keywords: ["text watermark", "video text", "overlay text", "video branding", "caption overlay"] },
  { id: "social-media-resize", name: "Video Resize for Social Media", category: "Video", keywords: ["social media video", "instagram video", "tiktok size", "youtube shorts", "reels format"] },
  { id: "video-upscaler", name: "Video Upscaler (AI)", category: "Video", keywords: ["video upscaler", "ai upscale", "enhance resolution", "4k upscale", "video enhancement"] },
  { id: "animated-meme", name: "Animated Meme Generator", category: "Video", keywords: ["animated meme", "video meme", "gif meme", "meme maker", "viral video"] },
  
  // TEXT & WRITING TOOLS
  { id: "word-counter", name: "Word Counter", category: "Text & Writing", keywords: ["word counter", "count words", "character count", "text statistics", "writing tool"] },
  { id: "character-counter", name: "Character Counter", category: "Text & Writing", keywords: ["character counter", "letter count", "character limit", "text length", "char counter"] },
  { id: "sentence-case", name: "Sentence Case Converter", category: "Text & Writing", keywords: ["sentence case", "capitalize sentences", "text case", "case converter", "format text"] },
  { id: "uppercase", name: "Uppercase Converter", category: "Text & Writing", keywords: ["uppercase", "all caps", "capital letters", "text uppercase", "caps lock"] },
  { id: "lowercase", name: "Lowercase Converter", category: "Text & Writing", keywords: ["lowercase", "small letters", "uncapitalize", "text lowercase", "no caps"] },
  { id: "title-case", name: "Title Case Converter", category: "Text & Writing", keywords: ["title case", "headline case", "capitalize words", "title format", "proper case"] },
  { id: "remove-line-breaks", name: "Remove Line Breaks", category: "Text & Writing", keywords: ["remove line breaks", "single line", "join lines", "no breaks", "merge lines"] },
  { id: "remove-spaces", name: "Remove Extra Spaces", category: "Text & Writing", keywords: ["remove spaces", "trim spaces", "clean text", "whitespace", "space remover"] },
  { id: "remove-duplicates", name: "Remove Duplicate Lines", category: "Text & Writing", keywords: ["remove duplicates", "unique lines", "deduplicate", "filter duplicates", "distinct text"] },
  { id: "sort-text", name: "Sort Text Alphabetically", category: "Text & Writing", keywords: ["sort text", "alphabetize", "sort lines", "a-z sort", "text sorter"] },
  { id: "plagiarism-checker", name: "Plagiarism Checker", category: "Text & Writing", keywords: ["plagiarism checker", "duplicate content", "copy checker", "originality", "plagiarism detector"] },
  { id: "grammar-checker", name: "Grammar Checker", category: "Text & Writing", keywords: ["grammar checker", "spell check", "writing assistant", "proofread", "grammar fix"] },
  { id: "text-summarizer", name: "Text Summarizer", category: "Text & Writing", keywords: ["text summarizer", "summarize text", "tldr", "article summary", "condensed text"] },
  { id: "paraphraser", name: "Text Paraphraser", category: "Text & Writing", keywords: ["paraphraser", "rewrite text", "rephrase", "reword", "text spinner"] },
  { id: "text-translator", name: "Text Translator", category: "Text & Writing", keywords: ["translator", "translate text", "language translation", "multilingual", "google translate"] },
  { id: "paragraph-generator", name: "Random Paragraph Generator", category: "Text & Writing", keywords: ["paragraph generator", "random text", "sample text", "placeholder", "content filler"] },
  { id: "word-generator", name: "Random Word Generator", category: "Text & Writing", keywords: ["word generator", "random words", "word picker", "vocabulary", "word game"] },
  { id: "password-generator", name: "Random Password Generator", category: "Text & Writing", keywords: ["password generator", "secure password", "strong password", "random password", "password creator"] },
  { id: "username-generator", name: "Random Username Generator", category: "Text & Writing", keywords: ["username generator", "random username", "unique username", "name generator", "handle creator"] },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", category: "Text & Writing", keywords: ["lorem ipsum", "dummy text", "placeholder text", "sample content", "filler text"] },
  { id: "number-to-words", name: "Number to Words Converter", category: "Text & Writing", keywords: ["number to words", "spell number", "write number", "number converter", "text number"] },
  { id: "words-to-number", name: "Words to Number Converter", category: "Text & Writing", keywords: ["words to number", "text to number", "parse number", "number from words", "convert text"] },
  { id: "emoji-remover", name: "Emoji Remover", category: "Text & Writing", keywords: ["emoji remover", "remove emoji", "clean text", "strip emoji", "no emoji"] },
  { id: "find-replace", name: "Find & Replace Tool", category: "Text & Writing", keywords: ["find replace", "search replace", "text replace", "bulk replace", "edit text"] },
  { id: "keyword-density", name: "Keyword Density Checker", category: "Text & Writing", keywords: ["keyword density", "seo checker", "keyword analysis", "content seo", "word frequency"] },
  { id: "case-swap", name: "Case Swap Tool", category: "Text & Writing", keywords: ["case swap", "toggle case", "invert case", "swap uppercase", "case changer"] },
  { id: "text-merger", name: "Text Merger Tool", category: "Text & Writing", keywords: ["text merger", "combine text", "join text", "merge paragraphs", "text joiner"] },
  { id: "article-rewriter", name: "Article Rewriter", category: "Text & Writing", keywords: ["article rewriter", "content spinner", "rewrite article", "unique content", "article spinner"] },
  { id: "blog-ideas", name: "Blog Idea Generator", category: "Text & Writing", keywords: ["blog ideas", "content ideas", "topic generator", "blog topics", "writing inspiration"] },
  { id: "caption-creator", name: "Social Media Caption Creator", category: "Text & Writing", keywords: ["caption creator", "instagram caption", "social caption", "post caption", "engaging captions"] },
  { id: "hashtag-generator", name: "Hashtag Generator", category: "Text & Writing", keywords: ["hashtag generator", "trending hashtags", "instagram hashtags", "social tags", "hashtag tool"] },
  { id: "notes-app", name: "Notes App Online", category: "Text & Writing", keywords: ["notes app", "online notepad", "quick notes", "text editor", "note taking"] },
  { id: "calendar-generator", name: "Calendar Generator", category: "Text & Writing", keywords: ["calendar generator", "printable calendar", "monthly calendar", "yearly calendar", "custom calendar"] },
  { id: "todo-list", name: "To-Do List App", category: "Text & Writing", keywords: ["todo list", "task manager", "to do app", "task list", "productivity"] },
  { id: "pomodoro-timer", name: "Pomodoro Timer", category: "Text & Writing", keywords: ["pomodoro timer", "productivity timer", "focus timer", "work timer", "study timer"] },
  { id: "stopwatch", name: "Stopwatch", category: "Text & Writing", keywords: ["stopwatch", "timer", "lap timer", "time tracker", "online stopwatch"] },
  { id: "countdown-timer", name: "Countdown Timer", category: "Text & Writing", keywords: ["countdown timer", "event countdown", "timer app", "count down", "time remaining"] },
  { id: "typing-test", name: "Typing Speed Test", category: "Text & Writing", keywords: ["typing test", "wpm test", "typing speed", "keyboard test", "typing practice"] },
  { id: "paragraph-formatter", name: "Paragraph Formatter", category: "Text & Writing", keywords: ["paragraph formatter", "format text", "text cleanup", "clean paragraphs", "text formatter"] },
  { id: "quote-generator", name: "Random Quote Generator", category: "Text & Writing", keywords: ["quote generator", "random quotes", "inspirational quotes", "motivational", "daily quote"] },
  
  // DATA & DEV TOOLS
  { id: "json-formatter", name: "JSON Formatter", category: "Data & Dev", keywords: ["json formatter", "beautify json", "format json", "json viewer", "pretty json"] },
  { id: "json-validator", name: "JSON Validator", category: "Data & Dev", keywords: ["json validator", "validate json", "json syntax", "json checker", "json lint"] },
  { id: "json-to-csv", name: "JSON to CSV Converter", category: "Data & Dev", keywords: ["json to csv", "convert json", "json export", "data converter", "csv export"] },
  { id: "csv-to-json", name: "CSV to JSON Converter", category: "Data & Dev", keywords: ["csv to json", "convert csv", "data import", "json import", "spreadsheet to json"] },
  { id: "html-minifier", name: "HTML Minifier", category: "Data & Dev", keywords: ["html minifier", "minify html", "compress html", "reduce html", "optimize html"] },
  { id: "css-minifier", name: "CSS Minifier", category: "Data & Dev", keywords: ["css minifier", "minify css", "compress css", "reduce css", "optimize css"] },
  { id: "js-minifier", name: "JS Minifier", category: "Data & Dev", keywords: ["js minifier", "minify javascript", "compress js", "uglify js", "optimize js"] },
  { id: "uuid-generator", name: "UUID Generator", category: "Data & Dev", keywords: ["uuid generator", "guid generator", "unique id", "random uuid", "identifier"] },
  { id: "base64-encoder", name: "Base64 Encoder", category: "Data & Dev", keywords: ["base64 encoder", "encode base64", "text to base64", "base64 convert", "binary encoding"] },
  { id: "base64-decoder", name: "Base64 Decoder", category: "Data & Dev", keywords: ["base64 decoder", "decode base64", "base64 to text", "base64 convert", "binary decoding"] },
  { id: "url-encoder", name: "URL Encoder", category: "Data & Dev", keywords: ["url encoder", "encode url", "percent encoding", "url safe", "escape url"] },
  { id: "url-decoder", name: "URL Decoder", category: "Data & Dev", keywords: ["url decoder", "decode url", "unescape url", "url parsing", "query string"] },
  { id: "md5-generator", name: "MD5 Hash Generator", category: "Data & Dev", keywords: ["md5 hash", "md5 generator", "hash generator", "checksum", "file hash"] },
  { id: "sha256-generator", name: "SHA-256 Hash Generator", category: "Data & Dev", keywords: ["sha256 hash", "sha256 generator", "secure hash", "cryptographic hash", "hash algorithm"] },
  { id: "qr-generator", name: "QR Code Generator", category: "Data & Dev", keywords: ["qr code generator", "create qr", "qr maker", "barcode", "scan code"] },
  { id: "qr-scanner", name: "QR Code Scanner", category: "Data & Dev", keywords: ["qr scanner", "scan qr", "qr reader", "barcode scanner", "decode qr"] },
  { id: "regex-tester", name: "Regex Tester", category: "Data & Dev", keywords: ["regex tester", "regular expression", "regex validator", "pattern matching", "regex debugger"] },
  { id: "color-picker-dev", name: "Color Picker", category: "Data & Dev", keywords: ["color picker", "hex color", "rgb picker", "color codes", "color selector"] },
  { id: "hex-to-rgb", name: "HEX to RGB Converter", category: "Data & Dev", keywords: ["hex to rgb", "color converter", "hex color", "rgb values", "color conversion"] },
  { id: "rgb-to-hex", name: "RGB to HEX Converter", category: "Data & Dev", keywords: ["rgb to hex", "color converter", "rgb color", "hex values", "color conversion"] },
  { id: "cmyk-to-rgb", name: "CMYK to RGB Converter", category: "Data & Dev", keywords: ["cmyk to rgb", "print color", "color conversion", "cmyk converter", "design color"] },
  { id: "password-strength", name: "Password Strength Checker", category: "Data & Dev", keywords: ["password strength", "password checker", "security check", "strong password", "password meter"] },
  { id: "ip-finder", name: "IP Address Finder", category: "Data & Dev", keywords: ["ip finder", "my ip", "ip address", "public ip", "ip lookup"] },
  { id: "user-agent", name: "User Agent Detector", category: "Data & Dev", keywords: ["user agent", "browser info", "device detection", "ua string", "browser detector"] },
  { id: "browser-fingerprint", name: "Browser Fingerprint Tool", category: "Data & Dev", keywords: ["browser fingerprint", "device fingerprint", "tracking", "unique id", "privacy"] },
  { id: "screen-resolution", name: "Screen Resolution Checker", category: "Data & Dev", keywords: ["screen resolution", "display size", "monitor resolution", "viewport", "screen size"] },
  { id: "internet-speed", name: "Internet Speed Test", category: "Data & Dev", keywords: ["speed test", "internet speed", "bandwidth test", "connection speed", "mbps test"] },
  { id: "dns-lookup", name: "DNS Lookup", category: "Data & Dev", keywords: ["dns lookup", "domain lookup", "dns records", "nameserver", "dns query"] },
  { id: "whois-lookup", name: "WHOIS Lookup", category: "Data & Dev", keywords: ["whois lookup", "domain info", "registration info", "domain owner", "expiry date"] },
  { id: "barcode-generator", name: "Barcode Generator", category: "Data & Dev", keywords: ["barcode generator", "create barcode", "ean barcode", "upc code", "product barcode"] },
  
  // HEALTH & FITNESS TOOLS
  { id: "bmi-calculator", name: "BMI Calculator", category: "Health & Fitness", keywords: ["bmi calculator", "body mass index", "weight calculator", "healthy weight", "obesity check"] },
  { id: "body-fat", name: "Body Fat Calculator", category: "Health & Fitness", keywords: ["body fat calculator", "fat percentage", "body composition", "lean mass", "fitness calculator"] },
  { id: "calorie-calculator", name: "Calorie Calculator", category: "Health & Fitness", keywords: ["calorie calculator", "daily calories", "calorie needs", "weight loss", "diet planning"] },
  { id: "bmr-calculator", name: "BMR Calculator", category: "Health & Fitness", keywords: ["bmr calculator", "basal metabolic rate", "metabolism", "calorie burn", "resting calories"] },
  { id: "water-intake", name: "Water Intake Calculator", category: "Health & Fitness", keywords: ["water intake", "hydration calculator", "daily water", "drink water", "water needs"] },
  { id: "ideal-weight", name: "Ideal Weight Calculator", category: "Health & Fitness", keywords: ["ideal weight", "target weight", "healthy weight", "weight goal", "optimal weight"] },
  { id: "pregnancy-due", name: "Pregnancy Due Date Calculator", category: "Health & Fitness", keywords: ["due date calculator", "pregnancy calculator", "expected delivery", "baby due date", "conception date"] },
  { id: "ovulation", name: "Ovulation Calculator", category: "Health & Fitness", keywords: ["ovulation calculator", "fertility window", "conception", "menstrual cycle", "fertile days"] },
  { id: "heart-rate-zone", name: "Heart Rate Zone Calculator", category: "Health & Fitness", keywords: ["heart rate zones", "training zones", "cardio zones", "max heart rate", "fat burn zone"] },
  { id: "tdee-calculator", name: "TDEE Calculator", category: "Health & Fitness", keywords: ["tdee calculator", "total daily energy", "calorie expenditure", "maintenance calories", "energy needs"] },
  { id: "macro-calculator", name: "Macro Calculator", category: "Health & Fitness", keywords: ["macro calculator", "macronutrients", "protein carbs fat", "diet macros", "nutrition calculator"] },
  { id: "sleep-calculator", name: "Sleep Calculator", category: "Health & Fitness", keywords: ["sleep calculator", "sleep cycles", "wake time", "bedtime calculator", "rem sleep"] },
  { id: "step-calorie", name: "Step-to-Calorie Calculator", category: "Health & Fitness", keywords: ["steps to calories", "walking calories", "step counter", "calories burned", "fitness tracking"] },
  { id: "blood-pressure", name: "Blood Pressure Checker Guide", category: "Health & Fitness", keywords: ["blood pressure", "bp chart", "hypertension", "systolic diastolic", "heart health"] },
  { id: "waist-height", name: "Waist-to-Height Ratio Calculator", category: "Health & Fitness", keywords: ["waist to height", "whr calculator", "body ratio", "health indicator", "obesity risk"] },
];

async function generateBlogContent(tool: any, LOVABLE_API_KEY: string): Promise<string> {
  const prompt = `Write a comprehensive, SEO-optimized blog post about the "${tool.name}" tool. The article should be approximately 1500 words and highly engaging.

STRUCTURE:
1. Introduction (150 words) - Hook the reader, explain what the tool does and why it matters
2. What is ${tool.name}? (200 words) - Detailed explanation of the tool
3. Key Features and Benefits (250 words) - List 5-7 main features with explanations
4. How to Use ${tool.name} - Step by Step Guide (300 words) - Detailed tutorial
5. Why Choose Our ${tool.name} Over Others? (200 words) - Unique selling points
6. Common Use Cases (200 words) - Real-world applications and examples
7. Tips and Best Practices (150 words) - Pro tips for users
8. Frequently Asked Questions (200 words) - 4-5 relevant FAQs with answers

KEYWORDS TO INCLUDE NATURALLY: ${tool.keywords.join(", ")}

TONE: Professional yet friendly, informative, and helpful
FORMAT: Use proper HTML formatting with h2, h3, p, ul, li, strong, em tags
DO NOT include h1 tag (title is separate)
Make it engaging with practical examples and actionable advice.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an expert SEO content writer specializing in technology and software tools. Write engaging, comprehensive, and well-structured blog posts that rank well on search engines. Always output valid HTML content without markdown." },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AI API error for ${tool.name}:`, response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { startIndex = 0, batchSize = 10 } = await req.json();
    
    const batch = tools.slice(startIndex, startIndex + batchSize);
    const results: any[] = [];

    console.log(`Processing batch: ${startIndex} to ${startIndex + batchSize - 1}`);

    for (const tool of batch) {
      try {
        console.log(`Generating content for: ${tool.name}`);
        
        // Check if post already exists
        const { data: existing } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("slug", tool.id)
          .single();

        if (existing) {
          console.log(`Skipping ${tool.name} - already exists`);
          results.push({ id: tool.id, status: "skipped" });
          continue;
        }

        const content = await generateBlogContent(tool, LOVABLE_API_KEY);
        
        const excerpt = `Discover how to use ${tool.name} - your complete guide to ${tool.keywords[0]}. Learn features, tips, and best practices for ${tool.category.toLowerCase()} tasks.`;

        const blogPost = {
          title: `${tool.name}: Complete Guide & Tutorial ${new Date().getFullYear()}`,
          slug: tool.id,
          content: content,
          excerpt: excerpt,
          author: "Aman Rauniyar",
          category: tool.category,
          tags: tool.keywords,
          published: true,
          image: null,
        };

        const { data, error } = await supabase
          .from("blog_posts")
          .insert([blogPost])
          .select()
          .single();

        if (error) {
          console.error(`Error inserting ${tool.name}:`, error);
          results.push({ id: tool.id, status: "error", error: error.message });
        } else {
          console.log(`Successfully created: ${tool.name}`);
          results.push({ id: tool.id, status: "success" });
        }

        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error processing ${tool.name}:`, error);
        results.push({ id: tool.id, status: "error", error: errMsg });
      }
    }

    const nextIndex = startIndex + batchSize;
    const hasMore = nextIndex < tools.length;

    return new Response(
      JSON.stringify({
        success: true,
        processed: results,
        nextIndex: hasMore ? nextIndex : null,
        totalTools: tools.length,
        hasMore,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in generate-blog-posts:", error);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
