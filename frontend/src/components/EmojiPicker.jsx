import React, { useState } from "react";

const EMOJI_CATEGORIES = {
  recent: ["🛒", "🏠", "🚗", "🌳", "📱", "🎮", "💰", "🍔", "✈️", "👕"],
  money: ["💰", "💵", "💸", "🏦", "💳", "💎", "🤑", "💹", "📈", "🏧"],
  shopping: ["🛒", "🛍️", "👕", "👗", "👟", "💄", "🎽", "👜", "🕶️", "⌚"],
  travel: ["✈️", "🚗", "🚕", "🚄", "🚲", "⛴️", "🚅", "🚝", "🚠", "🚁"],
  food: ["🍔", "🍕", "🍜", "🍱", "🍳", "🥗", "🍖", "🥪", "🥤", "🍺"],
  home: ["🏠", "🛋️", "🛁", "🚿", "🛏️", "🪴", "🧺", "🧹", "💡", "🪑"],
};

const EmojiPicker = ({ selectedEmoji, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("recent");

  const categories = Object.keys(EMOJI_CATEGORIES);

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-4">
        <div
          onClick={() => setShowPicker(!showPicker)}
          className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center cursor-pointer hover:bg-purple-200 transition-all border-2 border-purple-300"
        >
          <span className="text-4xl">{selectedEmoji}</span>
        </div>
        <p className="text-gray-600 text-sm">Click to select an emoji</p>
      </div>

      {showPicker && (
        <div className="absolute top-full mt-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-96 z-50">
          {/* Category Tabs */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                  activeCategory === category
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 pr-2">
            <div className="grid grid-cols-5 gap-2">
              {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSelect(emoji);
                    setShowPicker(false);
                  }}
                  className="w-12 h-12 rounded-lg hover:bg-purple-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;