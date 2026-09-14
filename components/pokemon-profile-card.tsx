"use client";

import { type CSSProperties, type PointerEvent, useRef } from "react";

type CardVariable = `--${string}`;

const restStyle = {
  "--pointer-x": "50%",
  "--pointer-y": "50%",
  "--pointer-from-center": "0",
  "--pointer-from-top": "0.5",
  "--pointer-from-left": "0.5",
  "--card-opacity": "0",
  "--rotate-x": "0deg",
  "--rotate-y": "0deg",
  "--background-x": "50%",
  "--background-y": "50%",
  "--card-scale": "1",
  "--translate-x": "0px",
  "--translate-y": "0px",
} as CSSProperties;

/**
 * Adapted from simeydotme/pokemon-cards-css (GPL-3.0-or-later).
 * The original VMAX stylesheet and vmaxbg.jpg texture are bundled locally.
 */
export function PokemonProfileCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  function setVariable(name: CardVariable, value: string) {
    cardRef.current?.style.setProperty(name, value);
  }

  function updateCard(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !cardRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    const centerX = x - 50;
    const centerY = y - 50;
    const distance = Math.min(1, Math.hypot(centerX, centerY) / 50);

    setVariable("--pointer-x", `${x}%`);
    setVariable("--pointer-y", `${y}%`);
    setVariable("--pointer-from-center", String(distance));
    setVariable("--pointer-from-top", String(y / 100));
    setVariable("--pointer-from-left", String(x / 100));
    setVariable("--card-opacity", "1");
    setVariable("--rotate-x", `${-(centerX / 3.5)}deg`);
    setVariable("--rotate-y", `${centerY / 3.5}deg`);
    setVariable("--background-x", `${37 + x * 0.26}%`);
    setVariable("--background-y", `${33 + y * 0.34}%`);
  }

  function resetCard() {
    Object.entries(restStyle).forEach(([name, value]) => setVariable(name as CardVariable, String(value)));
  }

  return (
    <div className="pokemon-card-stage">
      <div
        className="card interactive vmax-profile-card"
        data-rarity="rare holo vmax"
        data-supertype="pokémon"
        ref={cardRef}
        style={restStyle}
      >
        <div className="card__translater">
          <div
            aria-label="이주원의 VMAX 홀로그램 프로필 사진. 마우스를 움직이면 원본 VMAX 포일 효과가 반응합니다."
            className="card__rotator"
            onBlur={resetCard}
            onPointerLeave={resetCard}
            onPointerMove={updateCard}
            role="img"
            tabIndex={0}
          >
            <div className="card__front">
              {/* eslint-disable-next-line @next/next/no-img-element -- Original card CSS targets an image element. */}
              <img
                alt="이주원의 프로필 사진"
                className="profile-photo"
                fetchPriority="high"
                src="/images/juwon-pokemon-card.png"
              />
              <div className="card__shine" aria-hidden="true" />
              <div className="card__glare" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
