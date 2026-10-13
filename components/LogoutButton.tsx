"use client";

export default function LogoutButton() {
  const baseUrl = process.env.APP_BASE_URL;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const returnTo = `${baseUrl}${basePath}/`;
  const logoutUrl = `${basePath}/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  return (
    <a
      href={logoutUrl}
      className="w-full text-center inline-block px-6 py-3 bg-[#f0f0f0] hover:bg-gray-200 text-gray-600 font-medium rounded-full text-[14px] transition-colors"
    >
      Logout
    </a>
  );
}