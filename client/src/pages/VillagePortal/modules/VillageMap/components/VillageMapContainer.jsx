import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import FacilityPopup from "./FacilityPopup";
import {
  getFacilityMarkerStyle,
  villageMarkerStyle,
} from "./markerStyles";
import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const createMapMarkerIcon = ({
  color,
  isVillage = false,
}) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: ${isVillage ? 34 : 28}px;
        height: ${isVillage ? 34 : 28}px;
        border-radius: 9999px 9999px 9999px 0;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          width: ${isVillage ? 12 : 9}px;
          height: ${isVillage ? 12 : 9}px;
          border-radius: 9999px;
          background: white;
          display: block;
        "></span>
      </div>
    `,
    iconSize: isVillage ? [34, 34] : [28, 28],
    iconAnchor: isVillage ? [17, 34] : [14, 28],
    popupAnchor: [0, -28],
  });

const villageMarkerIcon = createMapMarkerIcon({
  color: villageMarkerStyle.color,
  isVillage: true,
});

const getFacilityMarkerIcon = (category) =>
  createMapMarkerIcon({
    color: getFacilityMarkerStyle(category).color,
  });

const VillageMapContainer = ({
  villageLocation,
  facilities,
}) => {
const villageCoordinates =
  villageLocation?.village?.location?.coordinates ?? [];

  const center =
    villageCoordinates.length === 2
      ? [
          villageCoordinates[1],
          villageCoordinates[0],
        ]
      : [20.5937, 78.9629];

  const zoom =
    villageLocation?.zoomLevel ?? 14;

  const displayedFacilities =
    facilities ??
    villageLocation?.nearbyFacilities ??
    [];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Village Map
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Explore the village and nearby facilities.
        </p>
      </div>

      <div className="relative z-[1] isolate h-[600px] w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom
          className="relative z-[1] h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Village Marker */}
          <Marker
            position={center}
            icon={villageMarkerIcon}
          >
            <Popup>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">
                  {villageLocation?.village?.name?.en ||
                    villageLocation?.village?.name}
                </h3>
                  <p className="text-sm">
      Lat: {center[0]}
    </p>

    <p className="text-sm">
      Lng: {center[1]}
      </p>

                {villageLocation?.overview && (
                  <SmartTextRenderer
                    text={villageLocation.overview}
                    className="max-w-none [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-6"
                  />
                )}
              </div>
            </Popup>
          </Marker>

          {/* Nearby Facility Markers */}
          {displayedFacilities.map((facility) => {
            const coordinates =
              facility?.location?.coordinates ?? [];

            if (coordinates.length !== 2) {
              return null;
            }

            return (
              <Marker
                key={facility._id}
                position={[
                  coordinates[1],
                  coordinates[0],
                ]}
                icon={getFacilityMarkerIcon(
                  facility.category
                )}
              >
                <Popup>
                  <FacilityPopup
                    facility={facility}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
};

export default VillageMapContainer;
