import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const UNLOCK_KEY = "aich_devtools_unlocked";
const SIZE_THRESHOLD = 160; // px gap between outer/inner window when devtools is docked
const CHECK_EVERY_MS = 1500;

const EXTRA_PASSWORD: string = import.meta.env.VITE_DEVTOOLS_PASSWORD ?? "";
// Set VITE_DEVTOOLS_GUARD=off in your local .env to work comfortably while developing.
const GUARD_DISABLED = import.meta.env.VITE_DEVTOOLS_GUARD === "off";

function devtoolsLooksOpen(): boolean {
  // 1) Docked devtools shrink the viewport relative to the window
  const widthGap = window.outerWidth - window.innerWidth > SIZE_THRESHOLD;
  const heightGap = window.outerHeight - window.innerHeight > SIZE_THRESHOLD;
  if (widthGap || heightGap) return true;

  // 2) Undocked devtools: a `debugger` statement only pauses while devtools is open
  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  return performance.now() - start > 100;
}

/**
 * Hides the app and asks for an extra password whenever browser devtools are detected.
 * NOTE: this is a deterrent only. A frontend-only app can never be fully protected;
 * real security must come from the backend once it is added.
 */
export default function DevToolsGuard({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean>(() => sessionStorage.getItem(UNLOCK_KEY) === "1");
  const [locked, setLocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (GUARD_DISABLED || unlocked) return;

    const check = () => { if (devtoolsLooksOpen()) setLocked(true); };
    check();
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    window.addEventListener("resize", check);

    const blockMenu = (e: MouseEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const devShortcut =
        e.key === "F12" ||
        (ctrl && e.shiftKey && ["i", "j", "c", "k"].includes(k)) || // Chrome/Edge/Firefox inspect & console
        (ctrl && e.altKey && ["i", "j", "u"].includes(k)) ||        // Mac: Cmd+Opt+I/J/U
        (ctrl && k === "u");                                         // view source
      if (devShortcut) {
        e.preventDefault();
        e.stopPropagation();
        setLocked(true);
      }
    };
    document.addEventListener("contextmenu", blockMenu);
    document.addEventListener("keydown", blockKeys, true);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", check);
      document.removeEventListener("contextmenu", blockMenu);
      document.removeEventListener("keydown", blockKeys, true);
    };
  }, [unlocked]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (EXTRA_PASSWORD && value === EXTRA_PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, "1");
      setUnlocked(true);
      setLocked(false);
      setValue("");
    } else {
      setError("Incorrect security password.");
    }
  };

  // While locked, the app is not rendered at all, so there is nothing to inspect
  if (locked && !unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink p-4">
        <form onSubmit={submit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-1 mt-0 text-lg font-semibold">Security check</h1>
          <p className="mb-3 text-sm text-gray-600">
            Developer tools were detected. Enter the additional security password to continue.
          </p>
          {error && <div className="alert alert-danger py-2 text-sm" role="alert">{error}</div>}
          {!EXTRA_PASSWORD && (
            <div className="alert alert-warning py-2 text-sm">No security password is configured (VITE_DEVTOOLS_PASSWORD).</div>
          )}
          <input type="password" className="form-control mb-3" placeholder="Security password" autoFocus
            value={value} onChange={(e) => { setValue(e.target.value); setError(""); }} required />
          <button type="submit" className="btn btn-primary w-100">Unlock</button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
