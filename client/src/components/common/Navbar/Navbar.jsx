import { useState } from "react";
import {
  Menu,
  X,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import useNavigation from "../../../hooks/useNavigation";

import useStates from "../../../hooks/useStates";
import SmartVillageMegaMenu from "./SmartVillageMegaMenu";

const Navbar = () => {
  const { items, loading } = useNavigation();

  const {
  states,
  villages,
  loadVillages,
} = useStates();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVillageOpen, setMobileVillageOpen] =
    useState(false);
  const [mobileActiveState, setMobileActiveState] =
    useState(null);
  const [mobileVillages, setMobileVillages] =
    useState([]);
  const [mobileVillagesLoading, setMobileVillagesLoading] =
    useState(false);

  const hasSupportersItem = items.some(
    (item) => item.path === "/our-supporters"
  );

  const navigationItems = hasSupportersItem
    ? items
    : [
        ...items,
        {
          _id: "our-supporters-navigation",
          label: "Our Supporters",
          path: "/our-supporters",
          parentId: null,
        },
      ];

  const parentItems = navigationItems.filter(
    (item) => !item.parentId
  );

  const getChildren = (parentId) =>
    navigationItems.filter(
      (item) => item.parentId === parentId
    );

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileVillageOpen(false);
    setMobileActiveState(null);
    setMobileVillages([]);
  };

  const handleMobileStateToggle = async (state) => {
    if (mobileActiveState === state.slug) {
      setMobileActiveState(null);
      setMobileVillages([]);
      return;
    }

    setMobileActiveState(state.slug);
    setMobileVillagesLoading(true);

    try {
      const villages = await loadVillages(state.slug);
      setMobileVillages(villages || []);
    } catch (error) {
      console.error("Failed to load villages:", error);
      setMobileVillages([]);
    } finally {
      setMobileVillagesLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="relative h-16 lg:h-20 flex items-center justify-center">

          {/* Desktop Menu */}
          <nav className="hidden lg:flex justify-center">
            <ul className="flex items-center gap-8 font-medium text-slate-700">

              {loading ? (
                <>
                  {[0, 1, 2, 3, 4].map((item) => (
                    <li key={item}>
                      <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                    </li>
                  ))}
                </>
              ) : (
              parentItems.map((item) => {
                const children = getChildren(item._id);

                return (
                  <li
                    key={item._id}
                    className="relative group"
                  >
{item.label === "CSIR Smart Village" ? (
  <>
    <button
      type="button"
      className="
        hover:text-blue-900
        transition-colors
      "
    >
      {item.label}
    </button>

    <SmartVillageMegaMenu
      states={states}
      villages={villages}
      loadVillages={loadVillages}
    />
  </>
) : (
  <Link
    to={item.path}
    className="hover:text-blue-900 transition-colors"
  >
    {item.label}
  </Link>
)}

                    {children.length > 0 && (
                      <ul
                        className="
                          absolute
                          left-0
                          top-full
                          hidden
                          group-hover:block
                          bg-white
                          border
                          rounded-lg
                          shadow-lg
                          min-w-[250px]
                          py-2
                          z-50
                        "
                      >
                        {children.map((child) => (
                          <li key={child._id}>
                            <Link
                              to={child.path}
                              className="
                                block
                                px-4
                                py-2
                                hover:bg-slate-100
                              "
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })
              )}

              <li>
                <Link
                  to="/admin/login"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-md
                    border
                    border-blue-900/30
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-blue-900
                    hover:bg-blue-900
                    hover:text-white
                    hover:border-blue-900
                    transition-colors
                  "
                >
                  <Shield size={16} />
                  Admin Login
                </Link>
              </li>

            </ul>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="
              lg:hidden
              absolute
              right-4
              p-2
              rounded-md
              hover:bg-slate-100
            "
          >
            {mobileOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-4">
            <ul className="space-y-1">

              {loading ? (
                <>
                  {[0, 1, 2, 3].map((item) => (
                    <li key={item}>
                      <div className="mx-3 my-3 h-5 animate-pulse rounded bg-slate-200" />
                    </li>
                  ))}
                </>
              ) : (
              parentItems.map((item) => {
                const isSmartVillage =
                  item.label === "CSIR Smart Village";

                if (isSmartVillage) {
                  return (
                    <li key={item._id}>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileVillageOpen(
                            !mobileVillageOpen
                          )
                        }
                        aria-expanded={mobileVillageOpen}
                        aria-controls="mobile-smart-village-menu"
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          py-3
                          px-3
                          rounded-lg
                          hover:bg-slate-100
                          focus-visible:outline
                          focus-visible:outline-2
                          focus-visible:outline-offset-2
                          focus-visible:outline-blue-700
                          text-slate-700
                          font-medium
                        "
                      >
                        <span>{item.label}</span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            mobileVillageOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      <div
                        id="mobile-smart-village-menu"
                        className={`overflow-hidden transition-all duration-300 ${
                          mobileVillageOpen
                            ? "max-h-[70vh] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="mt-1 space-y-1 border-l border-slate-200 pl-3">
                          {states.map((state) => {
                            const isActive =
                              mobileActiveState ===
                              state.slug;

                            return (
                              <div key={state._id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMobileStateToggle(
                                      state
                                    )
                                  }
                                  aria-expanded={isActive}
                                  aria-controls={`mobile-state-${state.slug}`}
                                  className={`
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-left
                                    text-sm
                                    font-medium
                                    transition-colors
                                    hover:bg-slate-100
                                    focus-visible:outline
                                    focus-visible:outline-2
                                    focus-visible:outline-offset-2
                                    focus-visible:outline-blue-700

                                    ${
                                      isActive
                                        ? "bg-blue-50 text-blue-800"
                                        : "text-slate-700"
                                    }
                                  `}
                                >
                                  <span>{state.name}</span>

                                  {isActive ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </button>

                                <div
                                  id={`mobile-state-${state.slug}`}
                                  className={`overflow-hidden transition-all duration-300 ${
                                    isActive
                                      ? "max-h-96 opacity-100"
                                      : "max-h-0 opacity-0"
                                  }`}
                                >
                                  <div className="space-y-1 py-1 pl-5">
                                    {isActive &&
                                      mobileVillagesLoading && (
                                        <p className="px-3 py-2 text-sm text-slate-500">
                                          Loading villages...
                                        </p>
                                      )}

                                    {isActive &&
                                      !mobileVillagesLoading &&
                                      mobileVillages.map(
                                        (village) => (
                                          <Link
                                            key={village._id}
                                            to={`/village/${village.slug}`}
                                            onClick={
                                              closeMobileMenu
                                            }
                                            className="
                                              block
                                              rounded-lg
                                              px-3
                                              py-2
                                              text-sm
                                              text-slate-600
                                              transition-colors
                                              hover:bg-slate-100
                                              hover:text-blue-800
                                              focus-visible:outline
                                              focus-visible:outline-2
                                              focus-visible:outline-offset-2
                                              focus-visible:outline-blue-700
                                            "
                                          >
                                            <span className="mr-2">
                                              &bull;
                                            </span>
                                            {village.name?.en ||
                                              village.name
                                                ?.regional ||
                                              village.name ||
                                              "Unnamed Village"}
                                          </Link>
                                        )
                                      )}

                                    {isActive &&
                                      !mobileVillagesLoading &&
                                      mobileVillages.length ===
                                        0 && (
                                        <p className="px-3 py-2 text-sm text-slate-500">
                                          No villages available.
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item._id}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className="
                        block
                        py-3
                        px-3
                        rounded-lg
                        hover:bg-slate-100
                        text-slate-700
                        font-medium
                      "
                    >
                      {item.label}
                    </Link>

                    {getChildren(item._id).map(
                      (child) => (
                        <Link
                          key={child._id}
                          to={child.path}
                          className="
                            block
                            ml-6
                            py-2
                            px-3
                            text-sm
                            text-slate-600
                          "
                          onClick={closeMobileMenu}
                        >
                          {child.label}
                        </Link>
                      )
                    )}
                  </li>
                );
              })
              )}

              <li>
                <Link
                  to="/admin/login"
                  onClick={closeMobileMenu}
                  className="
                    flex
                    items-center
                    gap-2
                    py-3
                    px-3
                    rounded-lg
                    border
                    border-blue-900/30
                    text-blue-900
                    font-semibold
                    hover:bg-blue-900
                    hover:text-white
                    transition-colors
                  "
                >
                  <Shield size={18} />
                  Admin Login
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
