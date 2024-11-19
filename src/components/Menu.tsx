import { useState } from 'react';

type MenuProps = {
  onNewGame: () => void;
  onShare: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
};

export function Menu({ onNewGame, onShare, onToggleTheme, isDarkMode }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'help' | 'privacy' | 'contact' | 'scoring' | null>(null);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleModalClose = () => {
    setModalContent(null);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 py-3 bg-[var(--title-bg)] text-[var(--title-text)]">
        <h1 className="text-xl font-bold m-0">Shape Sorter</h1>
        <div className="flex gap-3 items-center">
          <button
            onClick={onToggleTheme}
            className="bg-transparent border-none text-2xl cursor-pointer p-1"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1 bg-transparent border-none p-2 cursor-pointer"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <div className="w-6 h-0.5 bg-[var(--title-text)]" />
            <div className="w-6 h-0.5 bg-[var(--title-text)]" />
            <div className="w-6 h-0.5 bg-[var(--title-text)]" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed top-[60px] right-0 z-40 bg-[var(--menu-bg)] shadow-lg rounded-bl-lg overflow-hidden">
          <div className="flex flex-col">
            <button
              onClick={() => handleMenuClick(onNewGame)}
              className="px-5 py-3 text-left hover:bg-[var(--menu-hover)] text-[var(--text-color)]"
            >
              New Game
            </button>
            <button
              onClick={() => handleMenuClick(onShare)}
              className="px-5 py-3 text-left hover:bg-[var(--menu-hover)] text-[var(--text-color)]"
            >
              Share Game
            </button>
            <button
              onClick={() => {
                setModalContent('scoring');
                setIsOpen(false);
              }}
              className="px-5 py-3 text-left hover:bg-[var(--menu-hover)] text-[var(--text-color)]"
            >
              Scoring
            </button>
            <button
              onClick={() => {
                setModalContent('help');
                setIsOpen(false);
              }}
              className="px-5 py-3 text-left hover:bg-[var(--menu-hover)] text-[var(--text-color)]"
            >
              How to Play
            </button>
            <button
              onClick={() => {
                setModalContent('privacy');
                setIsOpen(false);
              }}
              className="px-5 py-3 text-left hover:bg-[var(--menu-hover)] text-[var(--text-color)]"
            >
              Privacy
            </button>
            <button
              onClick={() => {
                setModalContent('contact');
                setIsOpen(false);
              }}
              className="px-5 py-3 text-left hover:bg-[var(--menu-hover)] text-[var(--text-color)]"
            >
              Contact
            </button>
          </div>
        </div>
      )}

      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay)]">
          <div className="bg-[var(--modal-bg)] p-6 rounded-lg max-w-md mx-4">
            {modalContent === 'help' && (
              <>
                <h2 className="text-xl font-bold mb-4">How to Play</h2>
                <div className="space-y-2 mb-6">
                  <p>1. Drag and drop shapes onto the 6x6 grid</p>
                  <p>2. Complete rows or columns to clear them and score points</p>
                  <p>3. Game ends when no more shapes can be placed</p>
                </div>
              </>
            )}
            {modalContent === 'scoring' && (
              <>
                <h2 className="text-xl font-bold mb-4">Scoring System</h2>
                <div className="space-y-3 mb-6">
                  <p><strong>Basic Points:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>100 points for each completed row or column</li>
                    <li>500 bonus points for clearing the entire grid</li>
                  </ul>
                  
                  <p><strong>Special Shapes:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>At 1000 points: Unlock diagonal down shape (↘)</li>
                    <li>At 2000 points: Unlock diagonal up shape (↗)</li>
                  </ul>
                  
                  <p className="text-sm opacity-80 mt-4">
                    Tip: Try to clear multiple lines at once and aim for grid clears to maximize your score!
                  </p>
                </div>
              </>
            )}
            {modalContent === 'privacy' && (
              <>
                <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
                <p className="mb-6">We don't collect any personal data. Game seeds are stored in the URL only.</p>
              </>
            )}
            {modalContent === 'contact' && (
              <>
                <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                <p className="mb-6">Email: example@shapesort.game</p>
              </>
            )}
            <button
              onClick={handleModalClose}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}