"use client"; // this registers <Editor> as a Client Component
import {
  BlockNoteEditor as BlockNoteEditorOriginal,
  Block as BlockOriginal,
  BlockSchema,
  defaultBlockSchema,
  defaultProps,
  PartialBlock as PartialBlockOriginal,
} from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  createReactBlockSpec,
  useBlockNote,
} from "@blocknote/react";
import { useEffect, useMemo, useRef } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import { Emoji } from "./Emoji";

export type MyBlockSchema = BlockSchema & {
  emoji: {
    propSchema: {
      emoji: {
        default: "👍";
      };
      backgroundColor: {
        default: "transparent";
      };
      textColor: {
        default: "black";
      };
      textAlignment: {
        default: "left";
        values: readonly ["left", "center", "right", "justify"];
      };
    };
  };
};
export type BlockNoteEditor = BlockNoteEditorOriginal<MyBlockSchema>;
export type PartialBlock = PartialBlockOriginal<MyBlockSchema>;

type Block = BlockOriginal<MyBlockSchema>;

// Ref: https://github.com/TypeCellOS/BlockNote/blob/0ff6ed993eec400b3df720af95df26786770a3ea/packages/website/docs/.vitepress/theme/components/Examples/BlockNote/ReactBlockNote.tsx#L59
// Our <Editor> component that we can now use
export const Editor = ({
  onEditorReady,
  setTextCursorBlockId,
  editable,
}: {
  onEditorReady?: (editor: BlockNoteEditor | null) => void;
  setTextCursorBlockId?: (blockId: string | null) => void;
  editable: boolean;
}) => {
  const [doc, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(
      "blocknote-dev.yousefed.partykit.dev",
      // use a unique name as a "room" for your application:
      "jaechan-lee-project",
      doc,
    );
    return [doc, provider];
  }, []);

  const EmojiBlock = createReactBlockSpec({
    type: "emoji",
    propSchema: {
      ...defaultProps,
      emoji: {
        default: "👍" as const,
      },
    },
    containsInlineContent: false,
    render: ({ block }) => (
      <div className="absolute">
        <div
          className="relative -left-24 -top-3"
          onClick={() => {
            console.log("removeBlocks", block.id);
            editorRef.current?.removeBlocks([block]);
          }}
        >
          <Emoji emoji={block.props.emoji} />
        </div>
      </div>
    ),
  });

  const editorRef = useRef<BlockNoteEditor | null>(null);
  // Creates a new editor instance.
  const editor: BlockNoteEditor | null = useBlockNote({
    editable,
    collaboration: {
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),
      // Information (name and color) for this user:
      user: {
        name: "My Username",
        color: "#ff0000",
      },
    },
    blockSchema: {
      // Adds all default blocks.
      ...defaultBlockSchema,
      // Adds the custom image block.
      emoji: EmojiBlock,
    },
    onTextCursorPositionChange: (editor: BlockNoteEditor) => {
      const hoveredBlock: Block = editor.getTextCursorPosition().block;
      console.log("textCursorPosition", editor.getTextCursorPosition());
      if (setTextCursorBlockId) {
        setTextCursorBlockId(hoveredBlock.id);
      }
      console.log("onTextCursorPositionChange", hoveredBlock);
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (editor) {
      editor.isEditable = editable;
    }
  }, [editable, editor]);

  // Renders the editor instance using a React component.
  return (
    <div className="border-2">
      <BlockNoteView editor={editor} />
    </div>
  );
};
