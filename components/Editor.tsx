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
        default: "/important.png";
      };
      textBlockId: {
        default: "";
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
  onTextCursorPositionChange,
  editable,
  userName,
  docId,
}: {
  onEditorReady?: (editor: BlockNoteEditor | null) => void;
  setTextCursorBlockId?: (blockId: string | null) => void;
  onTextCursorPositionChange?: (textCursorPosition: {
    blockId: string;
    nextBlockId: string | null;
    prevBlockId: string | null;
  }) => void;
  editable: boolean;
  userName?: string;
  docId?: string;
}) => {
  const [doc, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(
      "blocknote-dev.yousefed.partykit.dev",
      // use a unique name as a "room" for your application:
      docId ? `jaechan-lee-project-${docId}` : "jaechan-lee-project",
      doc,
    );
    return [doc, provider];
  }, []);

  const EmojiBlock = createReactBlockSpec({
    type: "emoji",
    propSchema: {
      ...defaultProps,
      emoji: {
        default: "/important.png" as const,
      },
      textBlockId: {
        default: "" as const,
      },
    },
    containsInlineContent: false,
    render: ({ block }) => {
      const getLeftClass = (emojiLength: number) => {
        if (emojiLength === 1) return "-left-24";
        if (emojiLength === 2) return "-left-32";
        if (emojiLength === 3) return "-left-40";
        return "";
      };
      return (
        <div className="relative">
          <div
            className={
              "absolute flex " +
              getLeftClass(block.props.emoji.split(",").length)
            }
          >
            {block.props.emoji.split(",").map((emoji: string) => (
              <div
                key={emoji}
                onClick={() => {
                  console.log("removeBlocks", block.id, emoji);
                  const newEmoji = block.props.emoji
                    .split(",")
                    .filter((e) => e !== emoji)
                    .join(",");
                  if (newEmoji.length === 0) {
                    console.log("textBlockId", block.props.textBlockId);
                    const textBlock = editorRef.current?.getBlock(
                      block.props.textBlockId,
                    );
                    if (textBlock) {
                      editorRef.current?.updateBlock(block.props.textBlockId, {
                        props: { backgroundColor: "transparent" },
                      });
                    }

                    editorRef.current?.removeBlocks([block]);
                  } else {
                    editorRef.current?.updateBlock(block, {
                      type: "emoji",
                      props: {
                        emoji: newEmoji,
                      },
                    });
                  }
                }}
              >
                <Emoji emoji={emoji} />
              </div>
            ))}
          </div>
        </div>
      );
    },
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
        name: userName ?? "Anonymous",
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
      const textCursorPosition = editor.getTextCursorPosition();
      console.log("textCursorPosition", textCursorPosition);
      onTextCursorPositionChange?.({
        blockId: textCursorPosition.block.id,
        nextBlockId: textCursorPosition.nextBlock?.id ?? null,
        prevBlockId: textCursorPosition.prevBlock?.id ?? null,
      });
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
  return editor ? (
    <div className="border-2 flex-grow flex flex-col">
      <BlockNoteView editor={editor} />
      <div
        className="flex-grow"
        onClick={() => {
          // https://stackoverflow.com/a/3866442
          function setEndOfContenteditable(
            contentEditableElement: HTMLElement,
          ) {
            var range, selection;
            range = document.createRange(); //Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection(); //get the selection object (allows you to change selection)
            selection?.removeAllRanges(); //remove any selections already made
            selection?.addRange(range); //make the range you have just created the visible selection
          }
          const editable = document.querySelector<HTMLElement>(
            "[contenteditable=true]",
          );
          if (editable) {
            setEndOfContenteditable(editable);
          }
        }}
      ></div>
    </div>
  ) : (
    <div className="text-center">에디터 로딩중..</div>
  );
};
