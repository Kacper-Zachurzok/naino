import { signOut, useSession } from "next-auth/react";

const Layout: React.FC<{
  children?: any;
}> = ({ children }) => {
  const { data: sessionData } = useSession();

  const logout = () => {
    signOut();
  };

  return (
    <main className="bg-primary flex min-h-screen flex-col text-white">
      <header>
        <nav className="nav-primary">
          <p>{sessionData?.president?.fullName}</p>
          <button onClick={logout} className="btn">
            Logout
          </button>
        </nav>
      </header>
      <article className="flex flex-1 flex-col">{children}</article>
    </main>
  );
};

export default Layout;
