import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const ContactInformation = ({
  data = {},
}) => {
  const contactItems = [
    {
      icon: MapPin,
      label: "Office Address",
      value: data.address,
    },
    {
      icon: Mail,
      label: "Email",
      value: data.email,
      href: data.email ? `mailto:${data.email}` : null,
    },
    {
      icon: Phone,
      label: "Phone",
      value: data.phone,
      href: data.phone ? `tel:${data.phone}` : null,
    },
  ].filter((item) => item.value);

  return (
    <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          Reach Us
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Contact Information
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Connect with the CSIR Smart Village team for queries,
          collaborations, and project support.
        </p>
      </div>

      <div className="space-y-5">
        {contactItems.map(({ icon: Icon, label, value, href }) => {
          const content = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Icon size={20} />
              </span>

              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  {label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {value}
                </span>
              </span>
            </>
          );

          if (href) {
            return (
              <a
                key={label}
                href={href}
                className="flex gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={label}
              className="flex gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              {content}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ContactInformation;
