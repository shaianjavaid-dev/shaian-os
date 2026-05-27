"use client";

import { useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

interface Selection {
  source: "tableau" | "waste" | "foundation";
  pileIndex: number;
  cardIndex: number; // index within the pile (for tableau runs)
}

interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles
  tableau: Card[][]; // 7 columns
}

// ── Helpers ────────────────────────────────────────────────────────────────

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const RANK_LABELS: Record<number, string> = {
  1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7",
  8: "8", 9: "9", 10: "10", 11: "J", 12: "Q", 13: "K",
};

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "\u2665",
  diamonds: "\u2666",
  clubs: "\u2663",
  spades: "\u2660",
};

function isRed(suit: Suit) {
  return suit === "hearts" || suit === "diamonds";
}

function suitColor(suit: Suit) {
  return isRed(suit) ? "text-red-600" : "text-gray-900";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ suit, rank: rank as Rank, faceUp: false });
    }
  }
  return shuffle(deck);
}

function initGame(): GameState {
  const deck = buildDeck();
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] };
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }
  const stock = deck.slice(idx).map((c) => ({ ...c, faceUp: false }));
  return { stock, waste: [], foundations: [[], [], [], []], tableau };
}

function deepClone(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

function canPlaceOnTableau(moving: Card, target: Card | undefined): boolean {
  if (!target) return moving.rank === 13; // empty column, only kings
  return (
    target.faceUp &&
    isRed(moving.suit) !== isRed(target.suit) &&
    moving.rank === target.rank - 1
  );
}

function canPlaceOnFoundation(card: Card, pile: Card[]): boolean {
  if (pile.length === 0) return card.rank === 1;
  const top = pile[pile.length - 1];
  return card.suit === top.suit && card.rank === top.rank + 1;
}

function checkWin(foundations: Card[][]): boolean {
  return foundations.every((p) => p.length === 13);
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Solitaire({ onClose }: { onClose: () => void }) {
  const [game, setGame] = useState<GameState>(initGame);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState("");

  const flash = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1200);
  }, []);

  // ── Draw from stock ────────────────────────────────────────────────────

  function drawFromStock() {
    if (selection) {
      setSelection(null);
      return;
    }
    setGame((prev) => {
      const g = deepClone(prev);
      if (g.stock.length === 0) {
        // recycle waste back to stock
        g.stock = g.waste.reverse().map((c) => ({ ...c, faceUp: false }));
        g.waste = [];
      } else {
        const card = g.stock.pop()!;
        card.faceUp = true;
        g.waste.push(card);
      }
      return g;
    });
  }

  // ── Handle clicks ──────────────────────────────────────────────────────

  function handleWasteClick() {
    if (won) return;
    if (game.waste.length === 0) return;

    if (selection) {
      // clicking waste when something is already selected — deselect
      setSelection(null);
      return;
    }

    setSelection({ source: "waste", pileIndex: 0, cardIndex: game.waste.length - 1 });
  }

  function handleFoundationClick(pileIndex: number) {
    if (won) return;

    if (!selection) {
      // pick from foundation (rare but legal)
      const pile = game.foundations[pileIndex];
      if (pile.length === 0) return;
      setSelection({ source: "foundation", pileIndex, cardIndex: pile.length - 1 });
      return;
    }

    // try to place the selected card on this foundation
    const g = deepClone(game);
    let card: Card | undefined;

    if (selection.source === "waste") {
      card = g.waste[g.waste.length - 1];
    } else if (selection.source === "tableau") {
      const col = g.tableau[selection.pileIndex];
      // only the bottom card of the picked run matters
      card = col[selection.cardIndex];
      // foundation only accepts single cards — must be the last card in column
      if (selection.cardIndex !== col.length - 1) {
        flash("Only single cards to foundations");
        setSelection(null);
        return;
      }
    } else if (selection.source === "foundation") {
      card = g.foundations[selection.pileIndex][g.foundations[selection.pileIndex].length - 1];
    }

    if (!card || !canPlaceOnFoundation(card, g.foundations[pileIndex])) {
      flash("Invalid move");
      setSelection(null);
      return;
    }

    // execute
    if (selection.source === "waste") {
      g.waste.pop();
    } else if (selection.source === "tableau") {
      g.tableau[selection.pileIndex].pop();
      // flip new top card
      const col = g.tableau[selection.pileIndex];
      if (col.length > 0 && !col[col.length - 1].faceUp) {
        col[col.length - 1].faceUp = true;
      }
    } else if (selection.source === "foundation") {
      g.foundations[selection.pileIndex].pop();
    }

    g.foundations[pileIndex].push({ ...card, faceUp: true });
    setSelection(null);
    setGame(g);

    if (checkWin(g.foundations)) setWon(true);
  }

  function handleTableauClick(colIndex: number, cardIndex: number | null) {
    if (won) return;

    const col = game.tableau[colIndex];

    // clicking on empty column with no selection
    if (cardIndex === null && !selection) return;

    // picking a card from tableau
    if (!selection) {
      if (cardIndex === null) return;
      const card = col[cardIndex];
      if (!card.faceUp) return;
      setSelection({ source: "tableau", pileIndex: colIndex, cardIndex });
      return;
    }

    // placing cards
    const g = deepClone(game);
    const targetCol = g.tableau[colIndex];
    const topTarget = targetCol.length > 0 ? targetCol[targetCol.length - 1] : undefined;

    // gather cards to move
    let cardsToMove: Card[] = [];

    if (selection.source === "waste") {
      const card = g.waste[g.waste.length - 1];
      if (!canPlaceOnTableau(card, topTarget) && !(topTarget === undefined && card.rank === 13)) {
        flash("Invalid move");
        setSelection(null);
        return;
      }
      cardsToMove = [g.waste.pop()!];
    } else if (selection.source === "foundation") {
      const fPile = g.foundations[selection.pileIndex];
      const card = fPile[fPile.length - 1];
      if (!canPlaceOnTableau(card, topTarget) && !(topTarget === undefined && card.rank === 13)) {
        flash("Invalid move");
        setSelection(null);
        return;
      }
      cardsToMove = [fPile.pop()!];
    } else if (selection.source === "tableau") {
      const srcCol = g.tableau[selection.pileIndex];
      const movingCard = srcCol[selection.cardIndex];

      if (selection.pileIndex === colIndex) {
        // same column, deselect
        setSelection(null);
        return;
      }

      if (!canPlaceOnTableau(movingCard, topTarget) && !(topTarget === undefined && movingCard.rank === 13)) {
        flash("Invalid move");
        setSelection(null);
        return;
      }

      cardsToMove = srcCol.splice(selection.cardIndex);
      // flip new top
      if (srcCol.length > 0 && !srcCol[srcCol.length - 1].faceUp) {
        srcCol[srcCol.length - 1].faceUp = true;
      }
    }

    targetCol.push(...cardsToMove);
    setSelection(null);
    setGame(g);

    if (checkWin(g.foundations)) setWon(true);
  }

  // ── Auto-move to foundation (double-click shortcut via single-click on already-selected) ──

  function tryAutoFoundation() {
    if (!selection) return false;

    const g = deepClone(game);
    let card: Card | undefined;
    let source = selection.source;

    if (source === "waste") {
      card = g.waste[g.waste.length - 1];
    } else if (source === "tableau") {
      const col = g.tableau[selection.pileIndex];
      if (selection.cardIndex !== col.length - 1) return false;
      card = col[col.length - 1];
    } else {
      return false;
    }

    if (!card) return false;

    for (let fi = 0; fi < 4; fi++) {
      if (canPlaceOnFoundation(card, g.foundations[fi])) {
        if (source === "waste") {
          g.waste.pop();
        } else {
          g.tableau[selection.pileIndex].pop();
          const col = g.tableau[selection.pileIndex];
          if (col.length > 0 && !col[col.length - 1].faceUp) {
            col[col.length - 1].faceUp = true;
          }
        }
        g.foundations[fi].push({ ...card, faceUp: true });
        setSelection(null);
        setGame(g);
        if (checkWin(g.foundations)) setWon(true);
        return true;
      }
    }
    return false;
  }

  // ── New game ───────────────────────────────────────────────────────────

  function newGame() {
    setGame(initGame());
    setSelection(null);
    setWon(false);
    setMessage("");
  }

  // ── Render helpers ─────────────────────────────────────────────────────

  function isSelected(source: Selection["source"], pileIndex: number, cardIndex: number) {
    if (!selection) return false;
    if (selection.source !== source || selection.pileIndex !== pileIndex) return false;
    if (source === "tableau") return cardIndex >= selection.cardIndex;
    return cardIndex === selection.cardIndex;
  }

  function renderCard(
    card: Card,
    selected: boolean,
    onClick: () => void,
    key: string,
    style?: React.CSSProperties
  ) {
    if (!card.faceUp) {
      return (
        <div
          key={key}
          style={style}
          onClick={onClick}
          className="w-[60px] h-[84px] rounded-lg bg-blue-700 border-2 border-blue-900 cursor-pointer shadow-md flex items-center justify-center"
        >
          <div className="w-[48px] h-[72px] rounded border border-blue-500 bg-blue-800" />
        </div>
      );
    }

    const color = suitColor(card.suit);
    const symbol = SUIT_SYMBOLS[card.suit];
    const label = RANK_LABELS[card.rank];

    return (
      <div
        key={key}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`w-[60px] h-[84px] rounded-lg bg-white border-2 cursor-pointer shadow-md flex flex-col justify-between p-1 select-none
          ${selected ? "border-yellow-400 ring-2 ring-yellow-400" : "border-gray-300"}`}
      >
        <div className={`text-xs font-bold leading-none ${color}`}>
          {label}
          <br />
          {symbol}
        </div>
        <div className={`text-lg leading-none text-center ${color}`}>{symbol}</div>
        <div className={`text-xs font-bold leading-none self-end rotate-180 ${color}`}>
          {label}
          <br />
          {symbol}
        </div>
      </div>
    );
  }

  function renderEmptySlot(onClick: () => void, label?: string) {
    return (
      <div
        onClick={onClick}
        className="w-[60px] h-[84px] rounded-lg border-2 border-dashed border-green-600 cursor-pointer flex items-center justify-center"
      >
        {label && <span className="text-green-600 text-xs font-bold">{label}</span>}
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center bg-green-800"
      style={{ bottom: "120px" }}
      onClick={() => setSelection(null)}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between px-4 py-2">
        <h1 className="text-white font-bold text-lg tracking-wide">Klondike Solitaire</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-yellow-300 text-sm font-medium animate-pulse">{message}</span>
          )}
          <button
            onClick={newGame}
            className="text-white bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-sm font-medium"
          >
            New Game
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white bg-red-700 hover:bg-red-600 w-7 h-7 rounded flex items-center justify-center text-base font-bold leading-none"
            title="Close"
          >
            X
          </button>
        </div>
      </div>

      {/* Win overlay */}
      {won && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-green-700 mb-2">You Win!</h2>
            <p className="text-gray-600 mb-4">Congratulations!</p>
            <button
              onClick={newGame}
              className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Top row: stock, waste, gap, foundations */}
      <div
        className="flex gap-3 px-4 py-2 items-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stock */}
        <div onClick={drawFromStock}>
          {game.stock.length > 0 ? (
            <div className="w-[60px] h-[84px] rounded-lg bg-blue-700 border-2 border-blue-900 cursor-pointer shadow-md flex items-center justify-center relative">
              <div className="w-[48px] h-[72px] rounded border border-blue-500 bg-blue-800" />
              <span className="absolute bottom-0.5 right-1 text-blue-300 text-[10px] font-bold">
                {game.stock.length}
              </span>
            </div>
          ) : (
            renderEmptySlot(drawFromStock, "\u21BB")
          )}
        </div>

        {/* Waste */}
        <div onClick={handleWasteClick}>
          {game.waste.length > 0
            ? renderCard(
                game.waste[game.waste.length - 1],
                isSelected("waste", 0, game.waste.length - 1),
                () => {
                  if (
                    selection &&
                    selection.source === "waste" &&
                    selection.cardIndex === game.waste.length - 1
                  ) {
                    if (!tryAutoFoundation()) setSelection(null);
                    return;
                  }
                  handleWasteClick();
                },
                "waste-top"
              )
            : renderEmptySlot(() => {}, "")}
        </div>

        {/* Spacer */}
        <div className="w-[60px]" />

        {/* Foundations */}
        {game.foundations.map((pile, fi) => (
          <div key={`f-${fi}`} onClick={() => handleFoundationClick(fi)}>
            {pile.length > 0
              ? renderCard(
                  pile[pile.length - 1],
                  isSelected("foundation", fi, pile.length - 1),
                  () => handleFoundationClick(fi),
                  `f-${fi}-top`
                )
              : renderEmptySlot(() => handleFoundationClick(fi), SUIT_SYMBOLS[SUITS[fi]])}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div
        className="flex gap-3 px-4 pt-3 items-start flex-1 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {game.tableau.map((col, ci) => (
          <div
            key={`col-${ci}`}
            className="relative"
            style={{ width: 60, minHeight: 84 }}
            onClick={() => {
              if (col.length === 0 && selection) {
                handleTableauClick(ci, null);
              }
            }}
          >
            {col.length === 0 &&
              renderEmptySlot(() => {
                if (selection) handleTableauClick(ci, null);
              }, "K")}
            {col.map((card, cardIdx) => {
              const offset = card.faceUp ? 24 : 12;
              const top = col
                .slice(0, cardIdx)
                .reduce((acc, c) => acc + (c.faceUp ? 24 : 12), 0);

              return renderCard(
                card,
                isSelected("tableau", ci, cardIdx),
                () => {
                  if (
                    selection &&
                    selection.source === "tableau" &&
                    selection.pileIndex === ci &&
                    selection.cardIndex === cardIdx
                  ) {
                    // re-clicking same selection — try auto-foundation
                    if (!tryAutoFoundation()) setSelection(null);
                    return;
                  }
                  if (selection) {
                    handleTableauClick(ci, cardIdx);
                  } else {
                    handleTableauClick(ci, cardIdx);
                  }
                },
                `t-${ci}-${cardIdx}`,
                {
                  position: cardIdx === 0 ? "relative" : "absolute",
                  top: cardIdx === 0 ? 0 : top,
                  zIndex: cardIdx,
                }
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
