import csirLogo from "../../../assets/logos/CSIRCBRI-Logo.jpg";
// import cbriLogo from "../../../assets/logos/Smart.jpeg";
import smartVillageLogo from "../../../assets/logos/SmartVillage.jpeg";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200">

      <div className="max-w-7xl mx-auto">

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4">

          {/* Left Logos */}
          <div className="flex items-center gap-4">

            <img
              src={csirLogo}
              alt="CSIR-CBRI"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-16 lg:h-20 object-contain"
            />

            {/* <img
              src={cbriLogo}
              alt="CSIR Smart Village"
              className="h-16 lg:h-20 object-contain"
            /> */}

          </div>

          {/* Center Title */}
          <div className="flex-1 text-center px-6">

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

          {/* Right Logo */}
          <div>

            <img
              src={smartVillageLogo}
              alt="Smart Village Mission"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-20 lg:h-24 object-contain"
            />

          </div>

        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-4 py-4">

          {/* Top Logos */}
          <div className="flex justify-center items-center gap-4 mb-4">

            <img
              src={csirLogo}
              alt="CSIR-CBRI"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-12 object-contain"
            />

            {/* <img
              src={cbriLogo}
              alt="CSIR Smart Village"
              className="h-12 object-contain"
            /> */}

            <img
              src={smartVillageLogo}
              alt="Smart Village Mission"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-12 object-contain"
            />

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
