"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { GuestbookEntry } from "@/lib/guestbook";

type ToolInput = { name?: unknown; message?: unknown };
type ModelContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: ToolInput) => Promise<unknown>;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

const PAGE_SIZE = 20;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadEntries = useCallback(async (offset = 0) => {
    const response = await fetch(`/api/guestbook?offset=${offset}`, { cache: "no-store" });
    const result = (await response.json()) as { entries?: GuestbookEntry[]; error?: string };
    if (!response.ok || !result.entries) throw new Error(result.error || "방명록을 불러오지 못했습니다.");

    setEntries((current) => offset === 0 ? result.entries! : [...current, ...result.entries!]);
    setHasMore(result.entries.length === PAGE_SIZE);
  }, []);

  const submitEntry = useCallback(async (entryName: string, entryMessage: string, website = "") => {
    const cleanName = entryName.trim();
    const cleanMessage = entryMessage.trim();
    if (!cleanName || cleanName.length > 30) throw new Error("이름은 1~30자로 입력해주세요.");
    if (!cleanMessage || cleanMessage.length > 300) throw new Error("메시지는 1~300자로 입력해주세요.");

    const response = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cleanName, message: cleanMessage, website }),
    });
    const result = (await response.json()) as { entry?: GuestbookEntry; error?: string };
    if (!response.ok || !result.entry) throw new Error(result.error || "메시지를 남기지 못했습니다.");

    setEntries((current) => [result.entry!, ...current.filter((item) => item.id !== result.entry!.id)]);
    return result.entry;
  }, []);

  useEffect(() => {
    loadEntries()
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, [loadEntries]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    void Promise.resolve(context.registerTool({
      name: "create_guestbook_entry",
      title: "방명록 남기기",
      description: "이주원의 포트폴리오 방명록에 이름과 메시지를 공개적으로 남깁니다.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 30 },
          message: { type: "string", minLength: 1, maxLength: 300 },
        },
        required: ["name", "message"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (typeof input.name !== "string" || typeof input.message !== "string") {
          throw new Error("이름과 메시지가 필요합니다.");
        }
        const entry = await submitEntry(input.name, input.message);
        setStatus("메시지를 남겼어요. 고맙습니다!");
        return { id: entry.id, name: entry.name, createdAt: entry.created_at };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);

    return () => lifecycle.abort();
  }, [submitEntry]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    const form = new FormData(event.currentTarget);

    try {
      await submitEntry(name, message, String(form.get("website") ?? ""));
      setName("");
      setMessage("");
      setStatus("메시지를 남겼어요. 고맙습니다!");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "메시지를 남기지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLoadMore() {
    setIsLoading(true);
    setLoadError("");
    try {
      await loadEntries(entries.length);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "메시지를 더 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="guestbook-layout">
      <form className="guestbook-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label htmlFor="guest-name">이름</label>
          <span>{name.length}/30</span>
        </div>
        <input
          id="guest-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={30}
          autoComplete="name"
          placeholder="이름을 적어주세요"
          required
        />

        <div className="field-row message-label">
          <label htmlFor="guest-message">메시지</label>
          <span>{message.length}/300</span>
        </div>
        <textarea
          id="guest-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={300}
          rows={5}
          placeholder="짧은 인사나 이야기를 남겨주세요"
          required
        />
        <label className="honeypot" aria-hidden="true">
          웹사이트
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "남기는 중…" : "남기기"} <span aria-hidden="true">↗</span>
        </button>
        <p className="form-status" role="status" aria-live="polite">{status}</p>
      </form>

      <div className="entry-list" aria-live="polite">
        <div className="entry-list-head">
          <h3>남겨진 이야기</h3>
          <span>{entries.length ? `${entries.length}+` : "0"}</span>
        </div>

        {isLoading && entries.length === 0 && <p className="empty-state">메시지를 불러오고 있어요…</p>}
        {loadError && entries.length === 0 && <p className="empty-state">{loadError}</p>}
        {!isLoading && !loadError && entries.length === 0 && (
          <p className="empty-state">아직 남겨진 메시지가 없어요.<br />첫 번째 메시지를 남겨주세요.</p>
        )}

        {entries.map((entry, index) => (
          <article className="entry" key={entry.id}>
            <div className="entry-number">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <div className="entry-meta">
                <strong>{entry.name}</strong>
                <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
              </div>
              <p>{entry.message}</p>
            </div>
          </article>
        ))}

        {hasMore && (
          <button className="load-more" type="button" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? "불러오는 중…" : "더 보기"}
          </button>
        )}
      </div>
    </div>
  );
}
