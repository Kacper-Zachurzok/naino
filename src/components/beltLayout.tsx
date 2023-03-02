const BeltLayout: React.FC<{
  children?: any;
}> = ({ children }) => {
  return (
    <main className="bg-primary">
      <div className="screen-belt">{children}</div>
    </main>
  );
};

export default BeltLayout;
