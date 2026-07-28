import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const createContact = (displayOrder = 0) => ({
  _clientKey: `contact-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`,
  name: "",
  designation: "",
  phone: "",
  email: "",
  officeAddress: "",
  displayOrder,
});

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea = false,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label}
    </label>

    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        className={inputClass}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
    )}
  </div>
);

export default function ContactSection({
  formData,
  setFormData,
}) {
  const [openCards, setOpenCards] = useState(() =>
    new Set([0])
  );

  const contacts = formData.contactPersons || [];

  const updateContacts = (contactPersons) => {
    setFormData((prev) => ({
      ...prev,
      contactPersons,
    }));
  };

  const addContact = () => {
    const nextContacts = [
      ...contacts,
      createContact(contacts.length),
    ];

    updateContacts(nextContacts);
    setOpenCards((prev) => new Set(prev).add(nextContacts.length - 1));
  };

  const updateContact = (index, key, value) => {
    updateContacts(
      contacts.map((contact, contactIndex) =>
        contactIndex === index
          ? {
              ...contact,
              [key]:
                key === "displayOrder"
                  ? Number(value)
                  : value,
            }
          : contact
      )
    );
  };

  const deleteContact = (index) => {
    updateContacts(
      contacts.filter((_, contactIndex) => contactIndex !== index)
    );
  };

  const moveContact = (index, direction) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= contacts.length) {
      return;
    }

    const updated = [...contacts];
    const [contact] = updated.splice(index, 1);
    updated.splice(nextIndex, 0, contact);

    updateContacts(
      updated.map((item, itemIndex) => ({
        ...item,
        displayOrder: itemIndex,
      }))
    );
  };

  const toggleCard = (index) => {
    setOpenCards((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
            <Phone size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Contact Persons
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add one card per official contact person shown on the public portal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addContact}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Contact Person
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No contact persons added.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add at least one official contact for the village administration section.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => {
            const isOpen = openCards.has(index);

            return (
              <div
                key={contact._clientKey || index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => toggleCard(index)}
                  className="flex w-full items-center justify-between gap-4 bg-white p-4 text-left"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {contact.name || `Contact Person ${index + 1}`}
                    </p>
                    <p className="text-sm text-slate-500">
                      {contact.designation || "Designation not set"}
                    </p>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="text-slate-500" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-500" size={20} />
                  )}
                </button>

                {isOpen ? (
                  <div className="space-y-5 p-4">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field
                        label="Name"
                        value={contact.name}
                        onChange={(e) =>
                          updateContact(index, "name", e.target.value)
                        }
                        placeholder="Suresh Kumar"
                      />

                      <Field
                        label="Designation"
                        value={contact.designation}
                        onChange={(e) =>
                          updateContact(index, "designation", e.target.value)
                        }
                        placeholder="Village Development Officer"
                      />

                      <Field
                        label="Phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) =>
                          updateContact(index, "phone", e.target.value)
                        }
                        placeholder="+91 XXXXX XXXXX"
                      />



                      <Field
                        label="Email"
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          updateContact(index, "email", e.target.value)
                        }
                        placeholder="official@example.com"
                      />


                      <div className="md:col-span-2">
                        <Field
                          label="Office Address"
                          value={contact.officeAddress}
                          onChange={(e) =>
                            updateContact(index, "officeAddress", e.target.value)
                          }
                          placeholder="Office address"
                          textarea
                        />
                      </div>



                      <Field
                        label="Display Order"
                        type="number"
                        value={contact.displayOrder}
                        onChange={(e) =>
                          updateContact(index, "displayOrder", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                      <button
                        type="button"
                        onClick={() => moveContact(index, -1)}
                        disabled={index === 0}
                        className="rounded border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Move Up
                      </button>

                      <button
                        type="button"
                        onClick={() => moveContact(index, 1)}
                        disabled={index === contacts.length - 1}
                        className="rounded border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Move Down
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteContact(index)}
                        className="inline-flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Delete Contact
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
