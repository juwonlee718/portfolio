import { Guestbook } from "@/components/guestbook";
import { PokemonProfileCard } from "@/components/pokemon-profile-card";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.7" />
      <circle cx="12" cy="12" r="4.05" />
      <circle cx="17.45" cy="6.65" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

const projects = [
  {
    index: "01",
    eyebrow: "COMMUNITY · 2026",
    title: "scsc.dev",
    description: "2026-1 Developer",
    href: "https://scsc.dev",
    cta: "사이트 방문하기",
    tone: "dark",
  },
  {
    index: "02",
    eyebrow: "CHESS PUZZLE · INSTAGRAM",
    title: "Chess Cave",
    description: "체스 퍼즐을 짧고 선명하게. 총 조회수 11K+",
    href: "https://www.instagram.com/chess.cave/",
    cta: "Instagram에서 보기",
    tone: "orange",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="이주원 포트폴리오 홈">
          <span>JW</span>
          <strong>이주원</strong>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a href="#guestbook">Guestbook</a>
        </nav>
        <a className="header-cta" href="https://www.instagram.com/juwonys/" target="_blank" rel="noreferrer">
          Contact <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="kicker">HELLO, I&apos;M JUWON</p>
          <h1>
            궁금한 건 <span>들여다보고,</span>
            <br />재밌어 보이는 건 <em>직접 해보는 사람</em>
          </h1>
          <div className="hero-bottom">
            <p>호기심을 작은 결과물로 바꾸며 배우고 있습니다.</p>
            <a className="text-link" href="#work">
              만든 것 보기 <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        <PokemonProfileCard />
      </section>

      <section className="about-strip" id="about">
        <div className="shell about-strip-inner">
          <p className="section-label">ABOUT / 01</p>
          <blockquote>
            새로운 것을 발견하면 그냥 지나치기보다 직접 들여다봅니다.
            <br />재밌어 보이는 아이디어는 <span>작게라도 만들어보며</span> 배웁니다.
          </blockquote>
          <div className="about-meta">
            <span>Based in Seoul</span>
            <span>Curious by default</span>
          </div>
        </div>
      </section>

      <section className="work shell" id="work">
        <div className="section-heading">
          <div>
            <p className="kicker">SELECTED WORK</p>
            <h2>지금까지 해온 것</h2>
          </div>
          <p>관심이 생긴 곳에 직접 들어가 배우고, 좋아하는 것을 꾸준히 기록합니다.</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              className={`project-card project-card-${project.tone}`}
              href={project.href}
              key={project.title}
              target="_blank"
              rel="noreferrer"
            >
              <div className="project-topline">
                <span>{project.index}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="project-content">
                <p>{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <span>{project.description}</span>
              </div>
              <div className="project-cta">
                {project.tone === "orange" && <InstagramIcon className="instagram-icon" />}
                {project.cta}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="contact-band" id="contact">
        <div className="shell contact-band-inner">
          <div>
            <p className="section-label">CONTACT / 03</p>
            <h2>재밌는 이야기가<br />있다면, 반가워요.</h2>
          </div>
          <a href="https://www.instagram.com/juwonys/" target="_blank" rel="noreferrer">
            <span className="contact-platform"><InstagramIcon /> Instagram</span>
            <strong>@juwonys</strong>
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="guestbook shell" id="guestbook">
        <div className="guestbook-heading">
          <p className="kicker">GUESTBOOK / 04</p>
          <h2>왔다 간 흔적을<br />남겨주세요.</h2>
          <p>이름과 짧은 메시지만 있으면 돼요.</p>
        </div>
        <Guestbook />
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <a className="wordmark footer-wordmark" href="#top" aria-label="맨 위로 이동">
            <span>JW</span>
            <strong>이주원</strong>
          </a>
          <p>© {new Date().getFullYear()} 이주원</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
