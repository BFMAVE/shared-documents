import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

const site = new URL('https://bfmave.github.io/shared-documents/');
const encryptedDocument = 'https://raw.githubusercontent.com/BFMAVE/shared-documents/main/docs/document.bin';
const nonceLength = 12;
const [argument, output = 'document.pdf', ...extra] = process.argv.slice(2);

try {
  if (!argument || extra.length) {
    throw new Error('Usage: node download-pdf.mjs FULL_SHARING_LINK [output.pdf]');
  }

  const link = new URL(argument === '-' ? readFileSync(0, 'utf8').trim() : argument);
  const encodedKey = link.hash.slice(1);
  if (link.origin !== site.origin ||
      link.pathname.replace(/\/$/, '') !== '/shared-documents' ||
      !/^[A-Za-z0-9_-]{43}$/.test(encodedKey)) {
    throw new Error('Provide the full sharing link, including the part after #.');
  }

  const response = await fetch(encryptedDocument, {
    redirect: 'error',
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error('The encrypted document is unavailable (HTTP ' + response.status + ').');
  }

  const encrypted = new Uint8Array(await response.arrayBuffer());
  const key = await webcrypto.subtle.importKey(
    'raw', Buffer.from(encodedKey, 'base64url'), 'AES-GCM', false, ['decrypt']
  );
  const plaintext = await webcrypto.subtle.decrypt(
    { name: 'AES-GCM', iv: encrypted.subarray(0, nonceLength) },
    key,
    encrypted.subarray(nonceLength)
  ).catch(() => {
    throw new Error('Could not unlock the PDF with this sharing link.');
  });

  const pdf = Buffer.from(plaintext);
  if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('The unlocked document is missing a PDF header.');
  }
  await writeFile(output, pdf, { flag: 'wx' });
  console.log('Saved ' + output);
} catch (error) {
  console.error(error.code === 'EEXIST' ? 'The output file already exists.' : error.message);
  process.exitCode = 1;
}
