import React from "react";

interface Contact {
  contact_id: string;
  contact_name: string;
  email: string;
}

const ContactsList: React.FC = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts`, {
    method: "GET",
    cache: "no-store", 
  });

  if (!res.ok) {
    const error = await res.json();
    return (
      <div>
        <h2>Contact List</h2>
        <p>{error.error}</p>
      </div>
    );
  }

  const contacts: Contact[] = await res.json();

  return (
    <div className="m-auto flex justify-center items-start w-full flex-col">
      <h2 className="font-bold text-2xl">Contact List</h2>
      <ul>
        {contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <li key={contact.contact_id}>
            {index + 1}.  {contact.contact_name} - {contact.email}
            </li>
          ))
        ) : (
          <li>No contacts found.</li>
        )}
      </ul>
    </div>
  );
};

export default ContactsList;
