import ContactHero from "../../sections/contact/ContactHero";
import ContactInformation from "../../sections/contact/ContactInformation";
import ContactForm from "../../sections/contact/ContactForm";

const ContactPageRenderer = ({
  sections,
}) => {
  const heroSection = sections.find(
    (section) => section.sectionType === "CONTACT_HERO"
  );
  const formSection = sections.find(
    (section) => section.sectionType === "CONTACT_FORM"
  );
  const informationSection = sections.find(
    (section) => section.sectionType === "CONTACT_INFORMATION"
  );

  return (
    <main className="bg-slate-50">
      {heroSection && (
        <ContactHero
          data={heroSection.content}
        />
      )}

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {formSection && (
            <ContactForm
              data={formSection.content}
            />
          )}

          {informationSection && (
            <ContactInformation
              data={informationSection.content}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default ContactPageRenderer;
