import { Outlet } from "react-router-dom";
import Logo from "../../components/ui/Logo";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&display=swap');

.auth-root { font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif; }
.auth-display { font-family: 'Bricolage Grotesque', 'Figtree', ui-sans-serif, sans-serif; letter-spacing: -0.02em; }

.ecg-line {
  stroke-dasharray: 1400;
  stroke-dashoffset: 1400;
  animation: ecg-draw 5s cubic-bezier(.45,.05,.3,1) infinite;
}
@keyframes ecg-draw {
  0%   { stroke-dashoffset: 1400; opacity: 1; }
  70%  { stroke-dashoffset: 0;    opacity: 1; }
  90%  { stroke-dashoffset: 0;    opacity: 0; }
  100% { stroke-dashoffset: 1400; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ecg-line { animation: none; stroke-dashoffset: 0; }
}
`;

export default function AuthLayout() {
  return (
    <main className="auth-root flex min-h-screen bg-[#F7F9F8] text-[#0E2A2B]">
      <style>{css}</style>

      <section className="flex flex-1 flex-col px-6 py-8 sm:px-12 lg:px-16">
        <header>
          <Logo/>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <Outlet />
        </div>

        <footer className="text-xs text-[#5B7270]">
          © 2026 Vitala. All rights reserved.
        </footer>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#0E2A2B] lg:flex lg:w-[46%] xl:w-[50%]">
        <svg
          viewBox="0 0 800 300"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[18%] h-[34%] w-full"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 150 H170 L195 150 L215 90 L245 230 L275 40 L305 190 L325 150 H470 L490 150 L510 120 L530 175 L550 150 H800"
            stroke="#3DDC97"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-line"
          />
          <path
            d="M0 150 H800"
            stroke="#3DDC97"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        </svg>

        <div className="relative z-10 mt-auto max-w-lg p-12 xl:p-16">
          <h2 className="auth-display text-4xl font-bold leading-[1.1] text-white xl:text-5xl">
            Every patient, every shift, in sync.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-[#A9C3BF]">
            Appointments, records and your care team in one place, so your
            clinic runs as smoothly as it cares.
          </p>
        </div>
      </aside>
    </main>
  );
}