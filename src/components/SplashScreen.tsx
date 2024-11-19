import { useState } from 'react';

type SplashScreenProps = {
  onDismiss: (dontShowAgain: boolean) => void;
};

export function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-[var(--modal-bg)] p-6 rounded-lg max-w-md mx-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome to Shape Sorter!</h2>
        
        <div className="space-y-4 mb-6">
          <p>Place shapes on the 6x6 grid by dragging them from the side panel.</p>
          
          <div className="space-y-2">
            <p className="font-semibold">How to play:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Drag shapes onto the grid</li>
              <li>Complete rows or columns to clear them</li>
              <li>Score points for each cleared line</li>
              <li>Plan ahead using the next shape preview</li>
              <li>Game ends when no more shapes can be placed</li>
            </ul>
          </div>
          
          <p className="text-sm opacity-80">
            Tip: On touch devices, the shape will appear above your finger for better visibility
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded"
            />
            Don't show this again
          </label>

          <button
            onClick={() => onDismiss(dontShowAgain)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
}