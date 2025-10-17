import { Outlet, Link } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                Auralis
              </Link>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">v0.0.1</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Settings
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Help
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            © 2025 Auralis
          </div>
        </div>
      </footer>
    </div>
  )
}