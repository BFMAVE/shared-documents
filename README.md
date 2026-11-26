# Shared documents

Use the full sharing link to open the PDF in a browser. The part after `#` unlocks the document.

## Download without a browser

The [download script](https://raw.githubusercontent.com/BFMAVE/shared-documents/main/docs/download-pdf.mjs) runs with Node.js 18 or later and requires no GitHub login.

```sh
curl -fsSLO https://raw.githubusercontent.com/BFMAVE/shared-documents/main/docs/download-pdf.mjs
node download-pdf.mjs 'FULL_SHARING_LINK' document.pdf
```

Replace `FULL_SHARING_LINK` with the complete link you received. Pass `-` in its place to read the link from standard input.

The script fetches the encrypted file directly from GitHub. Another client can fetch [document.bin](https://raw.githubusercontent.com/BFMAVE/shared-documents/main/docs/document.bin) in one request. Decode the link fragment as a base64url AES-256 key. The first 12 bytes of the file are the nonce, and the last 16 bytes are the authentication tag. Use AES-GCM without additional authenticated data to decrypt the bytes between them.
