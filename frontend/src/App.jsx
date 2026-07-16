import React from 'react'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-orange-500">
          Tailwind is working 🎉
        </h1>
        <p className="text-gray-300">
          If this box has a dark background, rounded corners, and orange text, you're good to go.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 py-2 rounded-lg font-medium">
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
