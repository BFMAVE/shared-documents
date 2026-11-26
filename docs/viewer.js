const status = document.querySelector('#status');
const actions = document.querySelector('#actions');
const nonceLength = 12;

async function openDocument() {
  const encodedKey = location.hash.slice(1);
  if (!/^[A-Za-z0-9_-]{43}$/.test(encodedKey)) {
    status.textContent = 'Open the full sharing link to unlock the PDF.';
    return;
  }

  try {
    const keyBytes = Uint8Array.from(
      atob(encodedKey.replace(/-/g, '+').replace(/_/g, '/')),
      character => character.charCodeAt(0)
    );
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
    const response = await fetch('./document.bin');
    if (!response.ok) throw new Error('Document unavailable');

    const encrypted = new Uint8Array(await response.arrayBuffer());
    const pdf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: encrypted.subarray(0, nonceLength) },
      key,
      encrypted.subarray(nonceLength)
    );
    const url = URL.createObjectURL(new Blob([pdf], {type: 'application/pdf'}));
    document.querySelector('#read').href = url;
    document.querySelector('#download').href = url;
    actions.hidden = false;
    status.textContent = 'The PDF is ready to open or download.';
  } catch {
    status.textContent = 'This link could not unlock the PDF.';
  }
}

openDocument();
