// admin/src/components/AdminLoginGate.tsx
import { useState, type FC } from 'react';
import { LiquidGlassDefs, ThemeIcon } from './LiquidGlassDefs';

interface Props {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSuccess: () => void;
}

export const AdminLoginGate: FC<Props> = ({ darkMode, toggleDarkMode, onSuccess }) => {
  const [email, setEmail] = useState('byfalguni@gmail.com');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [qrData, setQrData] = useState<{ qrDataUrl: string; secret: string } | null>(null);
  const [authError, setAuthError] = useState('');

  const handleLogin = async () => {
    setAuthError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totpCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'Login failed');
      return;
    }
    onSuccess();
  };

  const handleShowQr = async () => {
    setAuthError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SETUP_QR', email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'Enter valid admin email & password first to view 2FA QR.');
      return;
    }
    setQrData(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <LiquidGlassDefs />
      <div className="admin-surface-card w-full max-w-md rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter">
            BY<span className="text-[#ff5733]">F</span>.
          </span>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="glass-subcard flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold"
          >
            <ThemeIcon darkMode={darkMode} />
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight">Admin 2FA Gate</h1>
        <p className="mt-1 text-xs opacity-60">
          Sign in with your MongoDB Bcrypt credentials and 6-digit Authenticator code.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold opacity-80">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input mt-1 w-full rounded-2xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold opacity-80">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input mt-1 w-full rounded-2xl px-4 py-3 text-sm"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold opacity-80">6-Digit TOTP Code</label>
            <input
              type="text"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className="glass-input mt-1 w-full rounded-2xl px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.4em]"
              placeholder="000000"
            />
          </div>

          {authError && <p className="text-xs font-semibold text-red-500">{authError}</p>}

          <button
            type="button"
            onClick={handleLogin}
            className="liquid-glass-active w-full cursor-pointer rounded-full py-3.5 text-xs font-bold shadow-lg"
          >
            Verify 2FA & Enter Admin →
          </button>

          <button
            type="button"
            onClick={handleShowQr}
            className="w-full cursor-pointer text-center text-xs font-medium opacity-60 underline hover:opacity-100"
          >
            First time setup? Scan 2FA QR
          </button>

          {qrData && (
            <div className="glass-subcard mt-4 rounded-2xl p-4 text-center">
              <img
                src={qrData.qrDataUrl}
                alt="TOTP QR"
                className="mx-auto my-2 h-40 w-40 rounded-xl"
              />
              <p className="break-all font-mono text-[10px] opacity-70">{qrData.secret}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};