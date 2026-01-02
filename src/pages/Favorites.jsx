import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { favorites, loading, fetchFavorites, removeFavorite } = useFavorites();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, navigate, fetchFavorites]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border-2 border-white">
            <div className="text-8xl mb-6">⭐</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">My Favorites</h1>
            <p className="text-gray-700 text-xl mb-8">You haven't added any favorites yet. Start exploring and save your favorite notes!</p>
            <a href="/notes" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              📖 Browse Notes
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-12 mb-12 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-4">
            ⭐ Your Collection
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">My Favorites</h1>
          <p className="text-xl text-white/90">{favorites.length} saved items</p>
        </div>

        <div className="grid gap-8">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {favorite.noteId?.title}
                  </h3>
                  {favorite.noteId?.description && (
                    <p className="text-gray-600 mb-4">{favorite.noteId.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>📊 Views: {favorite.noteId?.viewCount}</span>
                    <span>⭐ Rating: {favorite.noteId?.rating?.toFixed(1)}</span>
                    <span>📥 Downloads: {favorite.noteId?.downloadCount}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFavorite(favorite.noteId._id)}
                  className="text-red-600 hover:text-red-700 text-2xl"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
