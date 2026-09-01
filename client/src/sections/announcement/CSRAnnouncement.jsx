import "./CSRAnnouncement.css";

export const DEFAULT_ANNOUNCEMENT =
  "CSIR SMART Village Mission welcomes Corporates, NGOs, Industries & PSUs to invest CSR funds for the implementation of technologies towards building self-reliant and resilient villages.";

const CSRAnnouncement = ({ text }) => {
  const announcement =
    typeof text === "string" &&
    text.trim()
      ? text.trim()
      : DEFAULT_ANNOUNCEMENT;

  return (
    <section
      aria-label="CSR contribution announcement"
      className="csr-announcement"
    >
      <div className="csr-announcement__viewport">
        <div className="csr-announcement__track">
          <p className="csr-announcement__text">{announcement}</p>
          <p aria-hidden="true" className="csr-announcement__text">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CSRAnnouncement;
