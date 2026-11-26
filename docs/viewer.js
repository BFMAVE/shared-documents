const statusMessage = document.querySelector('#status');
const actions = document.querySelector('#actions');
const nonceLength = 12;

async function decryptFile(path, key) {
  const response = await fetch(path);
  if (!response.ok) throw new Error('Document unavailable');

  const encrypted = new Uint8Array(await response.arrayBuffer());
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: encrypted.subarray(0, nonceLength) },
    key,
    encrypted.subarray(nonceLength)
  );
}

async function openDocument() {
  const encodedKey = location.hash.slice(1);
  if (!/^[A-Za-z0-9_-]{43}$/.test(encodedKey)) {
    statusMessage.textContent = 'Open the full sharing link to unlock the PDF.';
    return;
  }

  try {
    const keyBytes = Uint8Array.from(
      atob(encodedKey.replace(/-/g, '+').replace(/_/g, '/')),
      character => character.charCodeAt(0)
    );
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
    const [pdf, summary] = await Promise.allSettled([
      decryptFile('./document.bin', key),
      decryptFile('./summary.bin', key).then(bytes => JSON.parse(new TextDecoder().decode(bytes)))
    ]);
    if (pdf.status === 'rejected') throw pdf.reason;

    const url = URL.createObjectURL(new Blob([pdf.value], {type: 'application/pdf'}));
    document.querySelector('#read').href = url;
    document.querySelector('#download').href = url;
    actions.hidden = false;
    if (summary.status === 'fulfilled') {
      const { title, subtitle, abstract } = summary.value;
      document.title = title;
      document.querySelector('#heading').textContent = title;
      document.querySelector('#subtitle').textContent = subtitle;
      document.querySelector('#subtitle').hidden = false;
      document.querySelector('#abstract').textContent = abstract;
      document.querySelector('#summary').hidden = false;
      statusMessage.textContent = '';
    } else {
      statusMessage.textContent = 'The PDF is ready to open or download.';
    }
  } catch {
    statusMessage.textContent = 'This link could not unlock the PDF.';
  }
}

openDocument();
