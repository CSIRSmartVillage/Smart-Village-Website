import cbriLogo from "../../../assets/logos/CBRI.png";
import csirLogo from "../../../assets/logos/CSIR.jpg";
import smartVillageLogo from "../../../assets/logos/SmartVillage.jpeg";
import eightyYearsLogo from "../../../assets/logos/80year.jpg";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200">

      <div className="max-w-7xl mx-auto">

        {/* Desktop Header */}
        <div className="hidden xl:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">

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

          {/* Center Title */}
          <div className="px-4 text-center">

            <h1
              className="
                flex
                items-baseline
                justify-center
                gap-2
                text-3xl
                font-bold
                text-slate-900
              "
            >
              <span
                className="tracking-wide"
                style={{
                  fontFamily: '"Montserrat", Arial, "Segoe UI", sans-serif',
                  fontWeight: 700,
                }}
              >
                CSIR
              </span>
              <span
                lang="hi"
                className="text-[1.18em] leading-[1.2]"
                style={{
                  fontFamily:
                    '"Tiro Devanagari Hindi", "Nirmala UI", Mangal, serif',
                  fontSynthesis: "weight",
                  fontWeight: 700,
                }}
              >
                ग्रामसेतु
              </span>
            </h1>

            <p
              className="
                text-slate-600
                mt-2
                text-lg
                font-normal
              "
              style={{
                fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
              }}
            >
              Connective STI to Rural India
            </p>

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

          {/* Title */}
          <div className="text-center">

            <h1
              className="
                flex
                items-baseline
                justify-center
                gap-2
                text-xl
                md:text-2xl
                font-bold
                text-slate-900
                leading-tight
              "
            >
              <span
                className="tracking-wide"
                style={{
                  fontFamily: '"Montserrat", Arial, "Segoe UI", sans-serif',
                  fontWeight: 700,
                }}
              >
                CSIR
              </span>
              <span
                lang="hi"
                className="text-[1.18em] leading-[1.2]"
                style={{
                  fontFamily:
                    '"Tiro Devanagari Hindi", "Nirmala UI", Mangal, serif',
                  fontSynthesis: "weight",
                  fontWeight: 700,
                }}
              >
                ग्रामसेतु
              </span>
            </h1>

            <p
              className="
                text-xs
                md:text-base
                text-slate-600
                mt-2
                leading-relaxed
                font-normal
              "
              style={{
                fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
              }}
            >
              Connective STI to Rural India
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;
