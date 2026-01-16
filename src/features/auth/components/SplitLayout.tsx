type Props = {
  left: React.ReactNode;
  children: React.ReactNode;
};

export default function SplitLayout({ left, children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left (Brand Panel) */}
        <aside className="hidden lg:flex items-center justify-center bg-mainColor">
          <div className="w-full h-full flex items-center justify-center">
            {left}
          </div>
        </aside>

        {/* Right (Form) */}
        <main className="flex items-center justify-center p-6">
          <div className="w-full max-w-[520px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
