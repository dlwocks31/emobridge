"use client"; // this registers <Editor> as a Client Component
import {
  BlockNoteEditor as BlockNoteEditorOriginal,
  Block as BlockOriginal,
  BlockSchema,
  PartialBlock as PartialBlockOriginal,
  defaultBlockSchema,
  defaultProps,
} from "@blocknote/core";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  createReactBlockSpec,
  useBlockNote,
} from "@blocknote/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import { GlobalContext } from "../app/providers";
import { insertLog } from "../utils/logs";
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
  image: {
    propSchema: {
      src: {
        default: string;
      };
      alt: {
        default: string;
      };
    };
  };
};
export type BlockNoteEditor = BlockNoteEditorOriginal<MyBlockSchema>;
export type PartialBlock = PartialBlockOriginal<MyBlockSchema>;

type Block = BlockOriginal<MyBlockSchema>;
export interface EditorEmojiStatus {
  blockId: string | null; // null if virtual block. ex placeholder
  textBlockId: string;
  emojiUrls: string[];
  height: number;
}

const getAbsoluteTop = (elem: HTMLElement) => {
  return elem.getBoundingClientRect().top + window.scrollY;
};

// Ref: https://github.com/TypeCellOS/BlockNote/blob/0ff6ed993eec400b3df720af95df26786770a3ea/packages/website/docs/.vitepress/theme/components/Examples/BlockNote/ReactBlockNote.tsx#L59
// Our <Editor> component that we can now use
export const Editor = ({
  onEditorReady,
  onTextCursorPositionChange,
  editable,
  userName,
  docCollabKey,
  documentId,
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
  docCollabKey: string;
  documentId: number;
}) => {
  const {
    setFocusedBlockId: setFocusedBlockIdGlobal,
    setEditor: setEditorGlobal,
  } = useContext(GlobalContext);
  const [doc, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(
      "emobridge.dlwocks31.partykit.dev",
      `jaechan-lee-project-${docCollabKey}`,
      doc,
    );
    return [doc, provider];
  }, []);

  const [editorEmojiStatus, setEditorEmojiStatus] = useState<
    EditorEmojiStatus[]
  >([]);

  const [focusedBlock, setFocusedBlock] = useState<{
    id: string;
    height: number;
  } | null>(null);

  const removeEmoji = async (blockId: string, emojiUrl: string) => {
    const block = editorRef.current?.getBlock(blockId);
    if (!block) return;
    console.log("removeBlocks", block.id, emojiUrl);
    const newEmoji = block.props.emoji
      .split(",")
      .filter((e) => e !== emojiUrl)
      .join(",");
    const textBlockId = block.props.textBlockId;
    if (newEmoji.length === 0) {
      console.log("textBlockId", block.props.textBlockId);
      const textBlock = editorRef.current?.getBlock(block.props.textBlockId);
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

    const { error } = await insertLog({
      logType: "deleteEmoji",
      documentId: documentId,
      emojiType: emojiUrl,
      targetBlockId: textBlockId,
    });
  };

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
    render: () => <div className="hidden"></div>,
  });

  const ImageBlock = createReactBlockSpec({
    type: "image",
    propSchema: {
      src: {
        default: "https://via.placeholder.com/1000",
      },
      alt: {
        default: "placeholder",
      },
    },
    containsInlineContent: false,
    render: ({ block }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          style={{
            width: "100%",
          }}
          src={block.props.src}
          alt={"Image"}
          contentEditable={false}
        />
      </div>
    ),
  });

  function updateAllEditorEmojiHeight(editor: BlockNoteEditor) {
    const newEditorEmojiStatus: EditorEmojiStatus[] = [];
    const emojiBlocksToRemove: string[] = [];
    editor.forEachBlock((block: Block): boolean => {
      if (block.type === "emoji") {
        const blockElem = document.querySelector(
          `div[data-id='${block.props.textBlockId}']`,
        ) as HTMLElement | null;
        console.log({ block, blockElem });

        if (blockElem) {
          newEditorEmojiStatus.push({
            blockId: block.id,
            textBlockId: block.props.textBlockId,
            emojiUrls: block.props.emoji.split(","),
            height: getAbsoluteTop(blockElem),
          });
        } else {
          console.warn("blockElem not found", block.props.textBlockId);
          emojiBlocksToRemove.push(block.id);
        }
      }
      return true; // continue traverse
    });
    setEditorEmojiStatus(newEditorEmojiStatus);
    if (emojiBlocksToRemove.length > 0) {
      editor.removeBlocks(emojiBlocksToRemove);
    }
  }

  function setFocusedBlockId(id: string | null) {
    if (!id) {
      setFocusedBlock(null);
      setFocusedBlockIdGlobal(null);
      return;
    }
    const blockElem = document.querySelector(
      `div[data-id='${id}']`,
    ) as HTMLElement | null;
    if (blockElem) {
      setFocusedBlockIdGlobal(id);
      setFocusedBlock({
        id,
        height: getAbsoluteTop(blockElem),
      });
    } else {
      console.warn("blockElem not found", id);
      setFocusedBlock(null);
    }
  }

  function updateFocusedBlockHeight() {
    if (!focusedBlock) return;
    const blockElem = document.querySelector(
      `div[data-id='${focusedBlock.id}']`,
    ) as HTMLElement | null;
    if (blockElem) {
      setFocusedBlock({
        ...focusedBlock,
        height: getAbsoluteTop(blockElem),
      });
    } else {
      console.warn("blockElem not found", focusedBlock.id);
      setFocusedBlock(null);
    }
  }

  const editorEmojiStatusWithPlaceholder = useMemo(() => {
    if (!focusedBlock) {
      return editorEmojiStatus;
    }
    const focusedBlockStatus = editorEmojiStatus.find(
      (status) => status.textBlockId === focusedBlock.id,
    );
    if (focusedBlockStatus) {
      // merge with focusedBlockStatus
      return editorEmojiStatus.map((status) => {
        if (status.textBlockId === focusedBlock.id) {
          return {
            ...status,
            emojiUrls:
              status.emojiUrls.length < 3
                ? status.emojiUrls.concat(["/placeholder.png"])
                : status.emojiUrls,
          };
        }
        return status;
      });
    } else {
      return editorEmojiStatus.concat([
        {
          blockId: null,
          textBlockId: focusedBlock.id,
          emojiUrls: ["/placeholder.png"],
          height: focusedBlock.height,
        },
      ]);
    }
  }, [editorEmojiStatus, focusedBlock]);

  console.log(
    "editorEmojiStatusWithPlaceholder",
    editorEmojiStatusWithPlaceholder,
  );

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
      image: ImageBlock,
    },
    onTextCursorPositionChange: (editor: BlockNoteEditor) => {
      const textCursorPosition = editor.getTextCursorPosition();
      onTextCursorPositionChange?.({
        blockId: textCursorPosition.block.id,
        nextBlockId: textCursorPosition.nextBlock?.id ?? null,
        prevBlockId: textCursorPosition.prevBlock?.id ?? null,
      });
      setFocusedBlockId(textCursorPosition.block.id);
    },
    onEditorContentChange: (editor: BlockNoteEditor) => {
      updateAllEditorEmojiHeight(editor);
      updateFocusedBlockHeight();
    },
    onEditorReady: (editor: BlockNoteEditor) => {
      editorRef.current = editor;
      updateAllEditorEmojiHeight(editor);
      if (onEditorReady) {
        onEditorReady(editor);
      }
      setEditorGlobal(editor);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.isEditable = editable;
    }
  }, [editable, editor]);

  // Renders the editor instance using a React component.
  return editor ? (
    <div className="flex flex-grow">
      <div className="w-0 justify-end flex pr-1">
        {editorEmojiStatusWithPlaceholder.map((e) => (
          <div
            key={e.blockId}
            className="absolute flex"
            style={{ top: e.height }}
          >
            {e.emojiUrls.map((emojiUrl) => (
              <div
                key={emojiUrl}
                onClick={() => {
                  if (e.blockId) {
                    removeEmoji(e.blockId, emojiUrl);
                  }
                }}
              >
                <Emoji emoji={emojiUrl} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="border-2 flex flex-col flex-grow">
        <OutsideClickHandler
          onOutsideClick={(e: MouseEvent) => {
            // FIXME: 원래 의도는 "이모지 입력"을 제외한 outside click일때 focused block을 없애는 것.
            // 그렇게 하는 이유는 이모지 입력 시에도 focused block을 없애면, 이모지 입력을 하나 한 후에 어포던스가 없어지는 이상한 사용경험이 나타나기 때문.
            // 하지만 이게 모든 img tag를 무시하는 건 이상하다. 더 좋은 방법이 있을 것.
            if ((e.target as HTMLElement)?.tagName !== "IMG") {
              setFocusedBlockId(null);
            }
          }}
        >
          <BlockNoteView editor={editor} theme="light" />
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
        </OutsideClickHandler>
      </div>
    </div>
  ) : (
    <div className="text-center">에디터 로딩중..</div>
  );
};
