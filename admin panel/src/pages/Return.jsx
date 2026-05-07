import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
  FaLink,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


// 🔥 FONT SIZE
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: el => el.style.fontSize,
          renderHTML: attrs => attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: size => ({ chain }) =>
        chain().setMark("textStyle", { fontSize: size }).run(),
    };
  },
});


// 🔥 FONT FAMILY
const FontFamily = Extension.create({
  name: "fontFamily",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontFamily: {
          default: null,
          parseHTML: el => el.style.fontFamily,
          renderHTML: attrs => attrs.fontFamily ? { style: `font-family:${attrs.fontFamily}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontFamily: family => ({ chain }) =>
        chain().setMark("textStyle", { fontFamily: family }).run(),
    };
  },
});


// 🔥 LINE HEIGHT
const LineHeight = Extension.create({
  name: "lineHeight",
  addGlobalAttributes() {
    return [{
      types: ["paragraph"],
      attributes: {
        lineHeight: {
          default: null,
          parseHTML: el => el.style.lineHeight,
          renderHTML: attrs => attrs.lineHeight ? { style: `line-height:${attrs.lineHeight}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setLineHeight: value => ({ chain }) =>
        chain().updateAttributes("paragraph", { lineHeight: value }).run(),
    };
  },
});


const Return = () => {
  const API = "http://localhost:5000/api";
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      LineHeight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  // FETCH
  useEffect(() => {
    if (!editor) return;
    axios.get(`${API}/policy/return`)
      .then(res => editor.commands.setContent(res.data.content || ""));
  }, [editor]);

  // SAVE
  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/policy/return`, {
        content: editor.getHTML(),
      });
      toast.success("Saved ✅");
    } catch {
      toast.error("Error ❌");
    }
    setLoading(false);
  };

  // DELETE
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/policy/privacy`, { content: "" });
      editor.commands.setContent("");
      toast.success("Deleted ✅");
    } catch {
      toast.error("Error ❌");
    }
    setLoading(false);
  };

  // LINK
  const addLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Return Policy Editor
      </h2>

      {/* 🔥 TOOLBAR */}
      <div className="flex flex-wrap gap-2 border rounded-lg p-2 bg-white shadow mb-3">

        {/* FONT FAMILY (Preview) */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="border px-2 py-1 rounded"
        >
          <option value="">Font</option>
          <option style={{ fontFamily: "Arial" }} value="Arial">Arial</option>
          <option style={{ fontFamily: "Poppins" }} value="Poppins">Poppins</option>
          <option style={{ fontFamily: "Times New Roman" }} value="Times New Roman">Times</option>
          <option style={{ fontFamily: "Courier New" }} value="Courier New">Courier</option>
        </select>

        {/* FONT SIZE */}
        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          className="border px-2 py-1 rounded"
        >
          <option value="">Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        {/* LINE HEIGHT */}
        <select
          onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
          className="border px-2 py-1 rounded"
        >
          <option value="">Spacing</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>

        {/* ICONS */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="iconBtn"><FaBold /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="iconBtn"><FaItalic /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="iconBtn"><FaUnderline /></button>

        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className="iconBtn">🎨</button>

        <button onClick={addLink} className="iconBtn"><FaLink /></button>

        <button onClick={() => editor.chain().focus().undo().run()} className="iconBtn"><FaUndo /></button>
        <button onClick={() => editor.chain().focus().redo().run()} className="iconBtn"><FaRedo /></button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="iconBtn"><FaListUl /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="iconBtn"><FaListOl /></button>

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className="iconBtn"><FaAlignLeft /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className="iconBtn"><FaAlignCenter /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className="iconBtn"><FaAlignRight /></button>

        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8"
        />
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="border p-3 md:p-4 rounded-lg min-h-[250px] bg-white"
      />

      {/* ACTION */}
      <div className="flex gap-3 mt-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Save"}
        </button>

        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Return;