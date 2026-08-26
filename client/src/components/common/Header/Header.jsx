import cbriLogo from "../../../assets/logos/CBRI.png";
import csirLogo from "../../../assets/logos/CSIR.jpg";
import smartVillageLogo from "../../../assets/logos/SmartVillage.jpeg";
import eightyYearsLogo from "../../../assets/logos/80year.jpg";
import headingImage from "../../../assets/logos/heading.jpeg";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200">

      <div className="max-w-7xl mx-auto">

        {/* Desktop Header */}
        <div className="hidden xl:grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-4 px-6 py-4">

          {/* Left Logos */}
          <div className="flex min-w-0 items-center justify-start gap-2 lg:gap-3">

            <img
              src={csirLogo}
              alt="CSIR"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-20 w-auto shrink-0 object-contain"
            />

            <img
              src={cbriLogo}
              alt="CSIR-CBRI"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-20 w-auto shrink-0 object-contain"
            />

          </div>

          {/* Center Heading */}
          <div className="flex min-w-0 items-center justify-center px-4">
            <img
              src={headingImage}
              alt="CSIR Gramsetu — CSIR Smart Village Management Portal"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-24 w-full object-contain"
            />
          </div>

          {/* Right Logos */}
          <div className="flex min-w-0 items-center justify-end gap-2 lg:gap-3">

            <img
              src={eightyYearsLogo}
              alt="80 Years of CSIR-CBRI"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-20 w-auto shrink-0 object-contain"
            />

            <img
              src={smartVillageLogo}
              alt="Smart Village Mission"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-20 w-auto shrink-0 object-contain"
            />

          </div>

        </div>

        {/* Mobile Header */}
        <div className="px-4 py-4 xl:hidden">

          {/* Top Logos */}
          <div className="mb-4 grid grid-cols-2 items-center gap-4">

            <div className="grid min-w-0 grid-cols-2 items-center gap-2">
              <div className="flex h-10 min-w-0 items-center justify-start sm:h-12 md:h-16">
                <img
                  src={csirLogo}
                  alt="CSIR"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex h-10 min-w-0 items-center justify-start sm:h-12 md:h-16">
                <img
                  src={cbriLogo}
                  alt="CSIR-CBRI"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 items-center gap-2">
              <div className="flex h-10 min-w-0 items-center justify-end sm:h-12 md:h-16">
                <img
                  src={eightyYearsLogo}
                  alt="80 Years of CSIR-CBRI"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex h-10 min-w-0 items-center justify-end sm:h-12 md:h-16">
                <img
                  src={smartVillageLogo}
                  alt="Smart Village Mission"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

          </div>

          {/* Heading */}
          <div className="flex min-w-0 items-center justify-center px-2 sm:px-4">
            <img
              src={headingImage}
              alt="CSIR Gramsetu — CSIR Smart Village Management Portal"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-16 w-full object-contain sm:h-20 md:h-24"
            />
          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;
