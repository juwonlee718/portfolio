"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useRef } from "react";

const restingCardStyle = {
  "--card-rotate-x": "0deg",
  "--card-rotate-y": "0deg",
  "--pointer-x": "50%",
  "--pointer-y": "50%",
  "--glare-opacity": "0",
} as CSSProperties;

/**
 * The interaction model is inspired by simeydotme/pokemon-cards-css:
 * https://github.com/simeydotme/pokemon-cards-css
 */
export function PokemonProfileCard() {
  const cardRef = useRef<HTMLElement>(null);

  function updateCard(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    const pointerX = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const pointerY = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    const rotateY = (pointerX - 50) / 6;
    const rotateX = (50 - pointerY) / 7;

    cardRef.current.style.setProperty("--pointer-x", `${pointerX}%`);
    cardRef.current.style.setProperty("--pointer-y", `${pointerY}%`);
    cardRef.current.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    cardRef.current.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    cardRef.current.style.setProperty("--glare-opacity", "1");
  }

  function resetCard() {
    if (!cardRef.current) return;
    Object.entries(restingCardStyle).forEach(([property, value]) => {
      cardRef.current?.style.setProperty(property, String(value));
    });
  }

  return (
    <div className="pokemon-photo-stage">
      <article
        aria-label="이주원의 프로필 사진. 마우스를 올리면 프리즘 반짝임 효과가 움직입니다."
        className="pokemon-profile-photo"
        onPointerMove={updateCard}
        onPointerLeave={resetCard}
        onBlur={resetCard}
        ref={cardRef}
        style={restingCardStyle}
        tabIndex={0}
      >
        <div className="pokemon-photo-frame">
          <Image
            alt="이주원의 프로필 사진"
            fill
            priority
            sizes="(max-width: 860px) min(100vw - 48px, 400px), 400px"
            src="/images/juwon-pokemon-card.png"
            style={{ objectFit: "cover", objectPosition: "50% 53%" }}
          />
          <div className="pokemon-photo-glitter" aria-hidden="true" />
          <span className="photo-corner photo-corner-top" aria-hidden="true" />
          <span className="photo-corner photo-corner-bottom" aria-hidden="true" />
        </div>
      </article>
      <p className="pokemon-photo-hint">MOVE TO FIND THE GLITTER ↗</p>
    </div>
  );
}
