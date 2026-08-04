// Name formatting rules shared by the server and the UI.
//
// A "clean" name:
//   - contains only letters, plus single spaces, hyphens and apostrophes
//     (digits, parens, underscores, emoji, etc. are removed)
//   - has no leading/trailing/duplicate whitespace
//   - is title-cased: first letter of every word segment upper-case,
//     the rest lower-case (also after hyphens and apostrophes)

export function formatName(raw) {
  if (!raw) return '';

  let s = raw.normalize('NFKC');

  // Keep letters (any language), spaces, hyphens, apostrophes. Drop the rest.
  s = s.replace(/[’‘]/g, "'");
  s = s.replace(/[^\p{L}\s'-]/gu, ' ');

  // Collapse whitespace and stray separator runs.
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/\s*-\s*/g, '-').replace(/-{2,}/g, '-');
  s = s.replace(/\s*'\s*/g, "'").replace(/'{2,}/g, "'");
  s = s.replace(/^[-']+|[-']+$/g, '');

  // Title-case each segment (segments start after space, hyphen, apostrophe).
  s = s
    .toLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (m) => m.toUpperCase());

  return s;
}

// Returns { firstname, lastname, changed } for a contact's current values.
export function suggestForContact(contact) {
  const firstname = formatName(contact.firstname);
  const lastname = formatName(contact.lastname);
  return {
    firstname,
    lastname,
    changed:
      firstname !== (contact.firstname || '') ||
      lastname !== (contact.lastname || ''),
  };
}
