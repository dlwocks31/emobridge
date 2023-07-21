"use client"; // this registers <Editor> as a Client Component
import {
  BlockNoteEditor,
  Block as BlockOriginal,
  BlockSchema,
  defaultBlockSchema,
  defaultProps,
} from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  InlineContent,
  createReactBlockSpec,
  useBlockNote,
} from "@blocknote/react";
import { useEffect, useMemo } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

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

type Block = BlockOriginal<MyBlockSchema>;

// Ref: https://github.com/TypeCellOS/BlockNote/blob/0ff6ed993eec400b3df720af95df26786770a3ea/packages/website/docs/.vitepress/theme/components/Examples/BlockNote/ReactBlockNote.tsx#L59
// Our <Editor> component that we can now use
const Editor = ({
  onEditorReady,
  setTextCursorBlockId,
}: {
  selectedEmoji: string;
  onEditorReady?: (editor: BlockNoteEditor<MyBlockSchema> | null) => void;
  setTextCursorBlockId: (blockId: string | null) => void;
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
      <div
        className="relative "
        onClick={() =>
          alert(`Emoji ${block.props.emoji} at block ${block.id} is clicked`)
        }
      >
        <div className="absolute -left-24 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
          {block.props.emoji}
        </div>
        <InlineContent />
      </div>
    ),
  });
  InlineContent;

  // Creates a new editor instance.
  const editor: BlockNoteEditor<MyBlockSchema> | null = useBlockNote({
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
    onTextCursorPositionChange: (editor: BlockNoteEditor<MyBlockSchema>) => {
      const hoveredBlock: Block = editor.getTextCursorPosition().block;
      console.log("textCursorPosition", editor.getTextCursorPosition());
      setTextCursorBlockId(hoveredBlock.id);
      console.log("onTextCursorPositionChange", hoveredBlock);
    },
  });

  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Renders the editor instance using a React component.
  return (
    <div className="border-2">
      <BlockNoteView editor={editor} />
    </div>
  );
};

export default Editor;
