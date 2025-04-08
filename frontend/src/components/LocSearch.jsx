import React from 'react'

const LocSearch = () => {
  return (
    <div>
        <form className="flex items-center gap-2 mb-4">
          <input
            type="text"
            // value={location}
            // onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location (e.g., Delhi)"
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
    </div>
  )
}

export default LocSearch