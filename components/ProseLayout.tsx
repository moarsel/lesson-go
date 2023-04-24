type ProseProps = {
  children: React.ReactNode;
};

function ProseLayout({ children }: ProseProps) {
  return (
    <div className="col-span-12 prose sm:col-span-8 sm:col-start-2 lg:col-span-6 lg:col-start-3">
      {children}
    </div>
  );
}

export default ProseLayout;
