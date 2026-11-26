# Dirichlet GRH and the covolume of theta lifts

This manuscript is a human-readable reconstruction of Levent Alpöge and Claude’s proof of the generalized Riemann hypothesis for Dirichlet *L*-functions. It follows the [Lean formalization](https://github.com/lsernau/grh-lean/tree/72fead102f663d5c7a407964a13dc0cf9d977207/grh) and links proof steps to the corresponding Lean declarations.

Reconstruction orchestrated by Brecht Verbeken. Drafted and revised by OpenAI Codex (GPT‑6.2 Sol).

The 26 November 2026 edition runs to 460 pages. [Read the manuscript](https://bfmave.github.io/shared-documents/)

## Retrieve the PDF through the GitHub connector

Open [connector/pdf.json](connector/pdf.json) in `BFMAVE/shared-documents`. It lists the parts of the PDF in order and gives the size and SHA-256 of the full file. Each part is under 1 MB.

1. Call the GitHub connector's `fetch_file` for every path in `parts`, with `encoding: "base64"` and the same repository ref for every call.
2. Base64-decode each response's `content` and concatenate the decoded bytes in the order given by the manifest.
3. Save the result as `dirichlet-grh.pdf`. The SHA-256 should match the manifest, and `pdfinfo` should report 460 pages.

When updating [the PDF in this repository](docs/dirichlet-grh.pdf), regenerate the parts and manifest in the same commit.
