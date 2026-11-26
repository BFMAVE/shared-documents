# Dirichlet GRH and the covolume of theta lifts

A reconstruction of the argument of Alpöge and Claude. The manuscript is dated 26 November 2026 and runs to 460 pages.

[Download the PDF](https://bfmave.github.io/shared-documents/dirichlet-grh.pdf) · [Read the abstract](https://bfmave.github.io/shared-documents/)

## Retrieve the PDF through the GitHub connector

Open [connector/pdf.json](connector/pdf.json) in `BFMAVE/shared-documents`. It lists the parts of the PDF in order and gives the size and SHA-256 of the full file. Each part is under 1 MB.

1. Call the GitHub connector's `fetch_file` for every path in `parts`, with `encoding: "base64"` and the same repository ref for every call.
2. Base64-decode each response's `content` and concatenate the decoded bytes in the order given by the manifest.
3. Save the result as `dirichlet-grh.pdf`. The SHA-256 should match the manifest, and `pdfinfo` should report 460 pages.

When updating [the PDF in this repository](docs/dirichlet-grh.pdf), regenerate the parts and manifest in the same commit.
