export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const PAGE_SIZE = 20;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, prefer?: string): HeadersInit {
  return {
    apikey: key,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function listEntries(offset = 0): Promise<GuestbookEntry[]> {
  const { url, key } = getSupabaseConfig();
  const query = new URLSearchParams({
    select: "id,name,message,created_at",
    is_visible: "eq.true",
    order: "created_at.desc,id.desc",
    offset: String(offset),
    limit: String(PAGE_SIZE),
  });
  const response = await fetch(`${url}/rest/v1/guestbook_entries?${query}`, {
    headers: headers(key),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Guestbook list request failed", response.status, await response.text());
    throw new Error("방명록을 불러오지 못했습니다.");
  }

  return (await response.json()) as GuestbookEntry[];
}

export async function createEntry(name: string, message: string): Promise<GuestbookEntry> {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/guestbook_entries`, {
    method: "POST",
    headers: headers(key, "return=representation"),
    body: JSON.stringify({ name, message }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Guestbook insert request failed", response.status, await response.text());
    throw new Error("메시지를 남기지 못했습니다.");
  }

  const entries = (await response.json()) as GuestbookEntry[];
  if (!entries[0]) throw new Error("저장된 메시지를 확인하지 못했습니다.");
  return entries[0];
}

export { PAGE_SIZE };
