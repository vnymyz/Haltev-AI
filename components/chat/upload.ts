export async function uploadProof(
  file: File,
  invoiceId: string,
  ownerId: string,
  lang: "id" | "en" = "id",
): Promise<{ ok: true; invoiceNumber: string } | { ok: false; error: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("invoiceId", invoiceId);
  fd.append("ownerId", ownerId);
  fd.append("lang", lang);
  try {
    const res = await fetch("/api/upload-proof", { method: "POST", body: fd });
    const json = await res.json();
    return json.ok ? { ok: true, invoiceNumber: json.invoiceNumber } : { ok: false, error: json.error ?? (lang === "en" ? "Upload failed." : "Upload gagal.") };
  } catch {
    return { ok: false, error: lang === "en" ? "Upload failed, check your connection and try again." : "Upload gagal, cek koneksi lalu coba lagi." };
  }
}
