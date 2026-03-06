import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { PDFDocument } from "@pdfme/pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type SplitMode = "range" | "every-n" | "extract" | "by-size" | "bookmarks";

interface PDFInfo {
  fileName: string;
  pageCount: number;
  fileSize: number;
  doc: PDFDocument;
  bytes: Uint8Array;
}

interface SplitRange {
  id: string;
  from: number;
  to: number;
  label: string;
}

interface SplitResult {
  name: string;
  blob: Blob;
  pageCount: number;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const PDFSplitterTool = () => {
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>("range");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SplitResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Range mode state
  const [ranges, setRanges] = useState<SplitRange[]>([
    { id: "1", from: 1, to: 1, label: "Part 1" },
  ]);

  // Every N pages mode
  const [everyN, setEveryN] = useState(1);

  // Extract specific pages
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  // By size mode
  const [maxSizeMB, setMaxSizeMB] = useState(5);

  // Range input text for quick entry
  const [rangeText, setRangeText] = useState("");

  const loadPDF = useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();

      setPdfInfo({
        fileName: file.name,
        pageCount,
        fileSize: file.size,
        doc,
        bytes,
      });

      setRanges([{ id: "1", from: 1, to: pageCount, label: "Part 1" }]);
      setEveryN(Math.min(1, pageCount));
      setSelectedPages(new Set());
      setResults([]);
      setProgress(0);

      toast({
        title: "PDF Loaded",
        description: `"${file.name}" — ${pageCount} page${pageCount !== 1 ? "s" : ""}, ${formatFileSize(file.size)}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to read PDF. The file may be corrupted or encrypted.",
        variant: "destructive",
      });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === "application/pdf") loadPDF(file);
      else
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
    },
    [loadPDF]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadPDF(file);
    },
    [loadPDF]
  );

  // ─── Range helpers ──────────────────────────
  const addRange = () => {
    if (!pdfInfo) return;
    setRanges((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: 1,
        to: pdfInfo.pageCount,
        label: `Part ${prev.length + 1}`,
      },
    ]);
  };

  const removeRange = (id: string) =>
    setRanges((prev) => prev.filter((r) => r.id !== id));

  const updateRange = (id: string, field: keyof SplitRange, value: string | number) =>
    setRanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );

  // ─── Parse range text like "1-3, 5, 7-10" ──
  const parseRangeText = (text: string, max: number): SplitRange[] => {
    const parts = text.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.map((part, i) => {
      const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (match) {
        return {
          id: `parsed-${i}`,
          from: Math.max(1, Math.min(parseInt(match[1]), max)),
          to: Math.max(1, Math.min(parseInt(match[2]), max)),
          label: `Part ${i + 1}`,
        };
      }
      const page = Math.max(1, Math.min(parseInt(part) || 1, max));
      return { id: `parsed-${i}`, from: page, to: page, label: `Part ${i + 1}` };
    });
  };

  const applyRangeText = () => {
    if (!pdfInfo || !rangeText.trim()) return;
    const parsed = parseRangeText(rangeText, pdfInfo.pageCount);
    if (parsed.length) {
      setRanges(parsed);
      toast({ title: "Ranges Applied", description: `${parsed.length} range(s) parsed.` });
    }
  };

  // ─── Toggle page selection ──────────────────
  const togglePage = (page: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const selectAll = () => {
    if (!pdfInfo) return;
    const all = new Set(Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1));
    setSelectedPages(all);
  };

  const selectNone = () => setSelectedPages(new Set());

  const selectOdd = () => {
    if (!pdfInfo) return;
    setSelectedPages(
      new Set(
        Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1).filter(
          (p) => p % 2 !== 0
        )
      )
    );
  };

  const selectEven = () => {
    if (!pdfInfo) return;
    setSelectedPages(
      new Set(
        Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1).filter(
          (p) => p % 2 === 0
        )
      )
    );
  };

  // ─── Core split logic ──────────────────────
  const extractPages = async (
    sourceBytes: Uint8Array,
    pageIndices: number[]
  ): Promise<Uint8Array> => {
    const src = await PDFDocument.load(sourceBytes as any, { ignoreEncryption: true });
    const dest = await PDFDocument.create();
    const pages = await dest.copyPages(src, pageIndices);
    pages.forEach((p) => dest.addPage(p));
    return dest.save() as unknown as Uint8Array;
  };

  const toBlob = (bytes: Uint8Array) =>
    new Blob([bytes.slice().buffer], { type: "application/pdf" });

  const splitPDF = async () => {
    if (!pdfInfo) return;
    setProcessing(true);
    setProgress(0);
    setResults([]);

    try {
      const splitResults: SplitResult[] = [];
      const baseName = pdfInfo.fileName.replace(/\.pdf$/i, "");

      if (splitMode === "range") {
        for (let i = 0; i < ranges.length; i++) {
          const r = ranges[i];
          const from = Math.max(1, Math.min(r.from, pdfInfo.pageCount));
          const to = Math.max(from, Math.min(r.to, pdfInfo.pageCount));
          const indices = Array.from({ length: to - from + 1 }, (_, j) => from - 1 + j);
          const bytes = await extractPages(pdfInfo.bytes, indices);
          splitResults.push({
            name: `${baseName}_${r.label || `part${i + 1}`}.pdf`,
             blob: toBlob(bytes),
            pageCount: indices.length,
          });
          setProgress(((i + 1) / ranges.length) * 100);
        }
      } else if (splitMode === "every-n") {
        const n = Math.max(1, everyN);
        const total = Math.ceil(pdfInfo.pageCount / n);
        for (let i = 0; i < total; i++) {
          const start = i * n;
          const end = Math.min(start + n, pdfInfo.pageCount);
          const indices = Array.from({ length: end - start }, (_, j) => start + j);
          const bytes = await extractPages(pdfInfo.bytes, indices);
          splitResults.push({
            name: `${baseName}_part${i + 1}.pdf`,
             blob: toBlob(bytes),
            pageCount: indices.length,
          });
          setProgress(((i + 1) / total) * 100);
        }
      } else if (splitMode === "extract") {
        const pages = Array.from(selectedPages).sort((a, b) => a - b);
        if (pages.length === 0) {
          toast({ title: "No Pages Selected", description: "Select at least one page.", variant: "destructive" });
          setProcessing(false);
          return;
        }
        const indices = pages.map((p) => p - 1);
        const bytes = await extractPages(pdfInfo.bytes, indices);
        splitResults.push({
          name: `${baseName}_extracted.pdf`,
           blob: toBlob(bytes),
          pageCount: indices.length,
        });
        setProgress(100);
      } else if (splitMode === "by-size") {
        const maxBytes = maxSizeMB * 1024 * 1024;
        let currentIndices: number[] = [];
        let partNum = 1;

        for (let i = 0; i < pdfInfo.pageCount; i++) {
          currentIndices.push(i);
          const testBytes = await extractPages(pdfInfo.bytes, currentIndices);
          if (testBytes.length > maxBytes && currentIndices.length > 1) {
            currentIndices.pop();
            const bytes = await extractPages(pdfInfo.bytes, currentIndices);
            splitResults.push({
              name: `${baseName}_part${partNum}.pdf`,
               blob: toBlob(bytes),
              pageCount: currentIndices.length,
            });
            partNum++;
            currentIndices = [i];
          }
          setProgress(((i + 1) / pdfInfo.pageCount) * 100);
        }

        if (currentIndices.length > 0) {
          const bytes = await extractPages(pdfInfo.bytes, currentIndices);
          splitResults.push({
            name: `${baseName}_part${partNum}.pdf`,
            blob: toBlob(bytes),
            pageCount: currentIndices.length,
          });
        }
        setProgress(100);
      }

      setResults(splitResults);
      toast({
        title: "Split Complete",
        description: `Created ${splitResults.length} PDF file${splitResults.length !== 1 ? "s" : ""}.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Split Failed",
        description: "An error occurred while splitting the PDF.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = (result: SplitResult) => {
    saveAs(result.blob, result.name);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    results.forEach((r) => zip.file(r.name, r.blob));
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${pdfInfo?.fileName.replace(/\.pdf$/i, "") || "split"}_all.zip`);
  };

  const reset = () => {
    setPdfInfo(null);
    setResults([]);
    setProgress(0);
    setSelectedPages(new Set());
    setRanges([{ id: "1", from: 1, to: 1, label: "Part 1" }]);
    setRangeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {!pdfInfo ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF file"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            aria-hidden="true"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Drop your PDF here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">Supports any PDF file • 100% browser-based</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* File info bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-xl">
            <Badge variant="secondary" className="text-xs">PDF</Badge>
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{pdfInfo.fileName}</span>
            <Badge variant="outline" className="text-xs">{pdfInfo.pageCount} pages</Badge>
            <Badge variant="outline" className="text-xs">{formatFileSize(pdfInfo.fileSize)}</Badge>
            <Button size="sm" variant="ghost" onClick={reset} className="ml-auto text-xs">
              Change File
            </Button>
          </div>

          {/* Split modes */}
          <Tabs value={splitMode} onValueChange={(v) => setSplitMode(v as SplitMode)}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto">
              <TabsTrigger value="range" className="text-xs sm:text-sm">Page Ranges</TabsTrigger>
              <TabsTrigger value="every-n" className="text-xs sm:text-sm">Every N Pages</TabsTrigger>
              <TabsTrigger value="extract" className="text-xs sm:text-sm">Extract Pages</TabsTrigger>
              <TabsTrigger value="by-size" className="text-xs sm:text-sm">By File Size</TabsTrigger>
            </TabsList>

            {/* ─── Range Mode ─── */}
            <TabsContent value="range" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Range Input</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. 1-3, 5, 7-10"
                    value={rangeText}
                    onChange={(e) => setRangeText(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" variant="secondary" onClick={applyRangeText}>
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Use commas to separate ranges. Each range becomes a separate PDF.</p>
              </div>

              <div className="space-y-3">
                {ranges.map((r, i) => (
                  <div key={r.id} className="flex flex-wrap items-end gap-2 p-3 bg-secondary/30 rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={r.label}
                        onChange={(e) => updateRange(r.id, "label", e.target.value)}
                        className="w-28 h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">From</Label>
                      <Input
                        type="number"
                        min={1}
                        max={pdfInfo.pageCount}
                        value={r.from}
                        onChange={(e) => updateRange(r.id, "from", parseInt(e.target.value) || 1)}
                        className="w-20 h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">To</Label>
                      <Input
                        type="number"
                        min={1}
                        max={pdfInfo.pageCount}
                        value={r.to}
                        onChange={(e) => updateRange(r.id, "to", parseInt(e.target.value) || 1)}
                        className="w-20 h-8 text-xs"
                      />
                    </div>
                    <Badge variant="outline" className="text-xs h-8 flex items-center">
                      {Math.max(0, r.to - r.from + 1)} pg
                    </Badge>
                    {ranges.length > 1 && (
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive" onClick={() => removeRange(r.id)}>
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={addRange}>
                + Add Range
              </Button>
            </TabsContent>

            {/* ─── Every N Pages ─── */}
            <TabsContent value="every-n" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Split every {everyN} page{everyN !== 1 ? "s" : ""}</Label>
                <Slider
                  value={[everyN]}
                  onValueChange={([v]) => setEveryN(v)}
                  min={1}
                  max={Math.max(1, pdfInfo.pageCount)}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 page each</span>
                  <span>{pdfInfo.pageCount} pages (no split)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will create <strong>{Math.ceil(pdfInfo.pageCount / Math.max(1, everyN))}</strong> PDF files.
                </p>
              </div>
            </TabsContent>

            {/* ─── Extract Pages ─── */}
            <TabsContent value="extract" className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Button size="sm" variant="outline" onClick={selectAll} className="text-xs">Select All</Button>
                <Button size="sm" variant="outline" onClick={selectNone} className="text-xs">Deselect All</Button>
                <Button size="sm" variant="outline" onClick={selectOdd} className="text-xs">Odd Pages</Button>
                <Button size="sm" variant="outline" onClick={selectEven} className="text-xs">Even Pages</Button>
                <Badge variant="secondary" className="text-xs flex items-center">
                  {selectedPages.size} selected
                </Badge>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2 bg-secondary/20 rounded-lg">
                {Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => togglePage(page)}
                    className={`h-10 rounded-md text-xs font-medium transition-colors border ${
                      selectedPages.has(page)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-pressed={selectedPages.has(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                All selected pages will be merged into a single PDF.
              </p>
            </TabsContent>

            {/* ─── By File Size ─── */}
            <TabsContent value="by-size" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Max file size per part: {maxSizeMB} MB</Label>
                <Slider
                  value={[maxSizeMB]}
                  onValueChange={([v]) => setMaxSizeMB(v)}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 MB</span>
                  <span>50 MB</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Each output PDF will be under <strong>{maxSizeMB} MB</strong>. Ideal for email attachments or upload limits.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={splitPDF}
              disabled={processing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {processing ? "Splitting…" : "Split PDF"}
            </Button>
            {results.length > 1 && (
              <Button variant="outline" onClick={downloadAllAsZip}>
                Download All as ZIP
              </Button>
            )}
          </div>

          {/* Progress bar */}
          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Split Results ({results.length} file{results.length !== 1 ? "s" : ""})
              </h3>
              <div className="grid gap-2">
                {results.map((result, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm font-medium text-foreground truncate">{result.name}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {result.pageCount} pg
                      </Badge>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {formatFileSize(result.blob.size)}
                      </Badge>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => downloadResult(result)}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
        {[
          { title: "100% Private", desc: "Files never leave your browser" },
          { title: "Unlimited", desc: "No file size or page limits" },
          { title: "Fast", desc: "Client-side WASM processing" },
          { title: "Free", desc: "No signup or payment required" },
        ].map((f) => (
          <div key={f.title} className="text-center p-3 bg-secondary/20 rounded-lg">
            <p className="text-xs font-semibold text-foreground">{f.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFSplitterTool;
