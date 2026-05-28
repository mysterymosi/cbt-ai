import type { UIMessage } from "ai";
import type { StoredTutorMessage } from "@/components/tutor/types";

export function storedMessagesToUi(messages: StoredTutorMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
  }));
}

export function uiMessagesToStored(messages: UIMessage[]): StoredTutorMessage[] {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: getTextFromUiMessage(message),
    }))
    .filter((message) => message.content.trim().length > 0);
}

function getTextFromUiMessage(message: UIMessage) {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}
