import cbriLogo from "../../../assets/logos/CBRI.png";
import csirLogo from "../../../assets/logos/CSIR.jpg";
import smartVillageLogo from "../../../assets/logos/SmartVillage.jpeg";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200">

      <div className="max-w-7xl mx-auto">

        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">

          {/* Left Logo */}
          <div className="flex items-center justify-start">

            <img
              src={csirLogo}
              alt="CSIR"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-16 w-auto object-contain lg:h-20"
            />

          </div>

          {/* Center Title */}
          <div className="px-4 text-center">

            <h1
              className="
                text-2  xl
                lg:text-3xl
                font-bold
                text-slate-900
                tracking-wide
              "
            >
              CSIR SMART VILLAGE MISSION
            </h1>

            <p
              className="
                text-slate-600
                mt-2
                text-lg
              "
            >
              CSIR–Central Building Research Institute, Roorkee
            </p>

          </div>

          {/* Right Logos */}
          <div className="flex items-center justify-end gap-2 lg:gap-3">

            <img
              src={cbriLogo}
              alt="CSIR-CBRI"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-16 w-auto object-contain lg:h-20"
            />

            <img
              src={smartVillageLogo}
              alt="Smart Village Mission"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-16 w-auto object-contain lg:h-20"
            />

          </div>

        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-4 py-4">

          {/* Top Logos */}
          <div className="mb-4 flex items-center justify-between gap-4">

            <img
              src={csirLogo}
              alt="CSIR"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-12 w-auto object-contain"
            />

            <div className="flex items-center gap-2">
              <img
                src={cbriLogo}
                alt="CSIR-CBRI"
                decoding="async"
                fetchPriority="high"
                loading="eager"
                className="h-12 w-auto object-contain"
              />

              <img
                src={smartVillageLogo}
                alt="Smart Village Mission"
                decoding="async"
                fetchPriority="high"
                loading="eager"
                className="h-12 w-auto object-contain"
              />
            </div>

          </div>

          {/* Title */}
          <div className="text-center">

            <h1
              className="
                text-xl
                font-bold
                text-slate-900
                leading-tight
              "
            >
              CSIR SMART VILLAGE
              <br />
              MISSION
            </h1>

            <p
              className="
                text-xs
                text-slate-600
                mt-2
                leading-relaxed
              "
            >
              CSIR–Central Building Research Institute
              <br />
              Roorkee
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;
