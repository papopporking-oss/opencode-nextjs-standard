import Navbar from "./_components/Navbar";

export default function Test2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar/>
      {children}
    </>
  );
}