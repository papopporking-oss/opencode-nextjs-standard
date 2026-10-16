export default function Navbar() {
  return (
    <div className="navbar bg-base-200 shadow-sm">
      
      <div className="flex-none">
        <div className="drawer">
          <input id="sidebar-drawer-id" type="checkbox" className="drawer-toggle"/>
          <div className="drawer-content">
            {/* Menu Icon */}
            <label htmlFor="sidebar-drawer-id" className="btn btn-square btn-ghost drawer-button" aria-label="Open drawer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="sidebar-drawer-id" aria-label="Close sidebar" className="drawer-overlay"/>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <li><a>Sidebar Item 1</a></li>
              <li><a>Sidebar Item 2</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 pl-2">
        <a className="btn btn-ghost">Admin</a>
      </div>

      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg aria-label="More" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
        </button>
      </div>

    </div>
  );
}