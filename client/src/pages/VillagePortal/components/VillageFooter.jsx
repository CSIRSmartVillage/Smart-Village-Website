const VillageFooter = () => {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h3 className="font-semibold text-lg">
              CSIR SMART Village
            </h3>

            <p className="text-slate-400 text-sm mt-1">
              SMART Village Management Portal
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} CSIR-CBRI.
            All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default VillageFooter;
