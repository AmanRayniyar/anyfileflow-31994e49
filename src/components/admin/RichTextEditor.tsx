import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  Code2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);
  const activeTab = useRef<"visual" | "html">("visual");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[300px] p-4 overflow-y-auto",
      },
    },
    onUpdate: ({ editor }) => {
      if (!isInternalUpdate.current) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML() && activeTab.current === "visual") {
      isInternalUpdate.current = true;
      editor.commands.setContent(value);
      isInternalUpdate.current = false;
    }
  }, [editor, value]);

  const handleHtmlChange = useCallback(
    (html: string) => {
      onChange(html);
      if (editor) {
        isInternalUpdate.current = true;
        editor.commands.setContent(html);
        isInternalUpdate.current = false;
      }
    },
    [editor, onChange]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden" ref={editorContainerRef}>
      <Tabs
        defaultValue="visual"
        onValueChange={(v) => {
          activeTab.current = v as "visual" | "html";
        }}
      >
        <div className="bg-muted/50 border-b border-border">
          <div className="flex items-center justify-between px-2 py-1">
            <TabsList className="h-8">
              <TabsTrigger value="visual" className="text-xs h-7 px-3">
                Visual Editor
              </TabsTrigger>
              <TabsTrigger value="html" className="text-xs h-7 px-3">
                <Code2 className="h-3 w-3 mr-1" />
                HTML Code
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="visual" className="mt-0">
            <div className="flex flex-wrap gap-1 p-2 border-t border-border bg-background/50">
              {/* Undo/Redo */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0"
              >
                <Redo className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1 self-center" />

              {/* Headings */}
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className="h-8 w-8 p-0"
              >
                <Heading1 className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className="h-8 w-8 p-0"
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className="h-8 w-8 p-0"
              >
                <Heading3 className="h-4 w-4" />
              </Toggle>

              <div className="w-px h-6 bg-border mx-1 self-center" />

              {/* Text Formatting */}
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                className="h-8 w-8 p-0"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                className="h-8 w-8 p-0"
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                className="h-8 w-8 p-0"
              >
                <Code className="h-4 w-4" />
              </Toggle>

              <div className="w-px h-6 bg-border mx-1 self-center" />

              {/* Lists */}
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className="h-8 w-8 p-0"
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
                className="h-8 w-8 p-0"
              >
                <Quote className="h-4 w-4" />
              </Toggle>

              <div className="w-px h-6 bg-border mx-1 self-center" />

              {/* Alignment */}
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className="h-8 w-8 p-0"
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className="h-8 w-8 p-0"
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className="h-8 w-8 p-0"
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>

              <div className="w-px h-6 bg-border mx-1 self-center" />

              {/* Link & Image */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setLink}
                className={`h-8 w-8 p-0 ${
                  editor.isActive("link") ? "bg-accent" : ""
                }`}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="h-8 w-8 p-0"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </div>

        <TabsContent value="visual" className="mt-0">
          <div className="max-h-[400px] overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </TabsContent>

        <TabsContent value="html" className="mt-0 p-4">
          <Textarea
            value={value}
            onChange={(e) => handleHtmlChange(e.target.value)}
            rows={15}
            className="font-mono text-sm"
            placeholder="Enter HTML content here..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
