import { NextResponse } from "next/server";
import { createEntry, listEntries } from "@/lib/guestbook";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const rawOffset = new URL(request.url).searchParams.get("offset") ?? "0";
    const offset = Math.min(1000, Math.max(0, Number.parseInt(rawOffset, 10) || 0));
    return NextResponse.json({ entries: await listEntries(offset) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "방명록을 불러오지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; message?: unknown; website?: unknown };

    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ accepted: true }, { status: 201 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 1 || name.length > 30) {
      return NextResponse.json({ error: "이름은 1~30자로 입력해주세요." }, { status: 400 });
    }
    if (message.length < 1 || message.length > 300) {
      return NextResponse.json({ error: "메시지는 1~300자로 입력해주세요." }, { status: 400 });
    }

    return NextResponse.json({ entry: await createEntry(name, message) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "메시지를 남기지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
