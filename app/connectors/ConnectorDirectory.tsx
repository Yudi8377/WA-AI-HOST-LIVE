"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingCart, Store, MessagesSquare, FilterX } from "lucide-react";

export type ConnectorDirectoryItem = {
  name: string;
  category: string;
  scope: string;
  access: string;
  status: "Perencanaan" | "Perlu persetujuan" | "Fondasi tersedia";
};

type Props = { connectors: ConnectorDirectoryItem[] };

function statusLabel(status: ConnectorDirectoryItem["status"]) {
  if (status === "Perlu persetujuan") return "Menunggu akses resmi";
  if (status === "Fondasi tersedia") return "Fondasi tersedia";
  return "Dalam perencanaan";
}

export default function ConnectorDirectory({ connectors }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [status, setStatus] = useState("Semua status");

  const categories = useMemo(
    () => [...new Set(connectors.map((connector) => connector.category))].sort((a, b) => a.localeCompare(b, "id")),
    [connectors]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");
    return connectors.filter((connector) => {
      const matchesQuery = !normalizedQuery || [
        connector.name,
        connector.category,
        connector.scope,
        connector.access,
      ].some((value) => value.toLocaleLowerCase("id").includes(normalizedQuery));
      const matchesCategory = category === "Semua kategori" || connector.category === category;
      const matchesStatus = status === "Semua status" || statusLabel(connector.status) === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [connectors, query, category, status]);

  const controlStyle = {
    width: "100%",
    minWidth: 0,
    border: "1px solid var(--apt-border, #d8dee8)",
    borderRadius: "10px",
    padding: "11px 12px",
    background: "var(--apt-surface, #fff)",
    color: "inherit",
    font: "inherit",
  } as const;

  return <>
    <div aria-label="Filter katalog konektor" className="apt-directory-controls" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "12px", margin: "16px 0" }}>
      <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
        Cari konektor
        <span style={{ position: "relative", display: "block" }}>
          <Search size={17} aria-hidden="true" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.65 }} />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nama, kategori, kemampuan…" aria-label="Cari nama atau kemampuan konektor" style={{ ...controlStyle, paddingLeft: "38px" }} />
        </span>
      </label>
      <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
        Kategori
        <select value={category} onChange={(event) => setCategory(event.target.value)} style={controlStyle}>
          <option>Semua kategori</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label style={{ display: "grid", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
        Status kesiapan
        <select value={status} onChange={(event) => setStatus(event.target.value)} style={controlStyle}>
          <option>Semua status</option>
          <option>Menunggu akses resmi</option>
          <option>Dalam perencanaan</option>
          <option>Fondasi tersedia</option>
        </select>
      </label>
    </div>
    <div aria-live="polite" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", margin: "8px 0 14px", fontSize: "13px" }}>
      <span>Menampilkan <b>{filtered.length}</b> dari <b>{connectors.length}</b> konektor</span>
      {(query || category !== "Semua kategori" || status !== "Semua status") && <button type="button" onClick={() => { setQuery(""); setCategory("Semua kategori"); setStatus("Semua status"); }} style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: 0, background: "transparent", color: "inherit", cursor: "pointer", font: "inherit", textDecoration: "underline" }}><FilterX size={15}/> Hapus filter</button>}
    </div>
    {filtered.length > 0 ? <div className="apt-connector-list">{filtered.map((connector) => <article className="apt-connector" key={connector.name}>
      <div className="apt-connector-icon">{connector.category === "Platform toko online" ? <Store size={19}/> : connector.category === "Pesan pelanggan" ? <MessagesSquare size={19}/> : <ShoppingCart size={19}/>}</div>
      <div className="apt-connector-main"><b>{connector.name}</b><p>{connector.scope}</p><small><b>Akses:</b> {connector.access}</small></div>
      <span className="apt-status-chip">{statusLabel(connector.status)}</span>
    </article>)}</div> : <div role="status" style={{ padding: "28px 16px", textAlign: "center", border: "1px dashed var(--apt-border, #d8dee8)", borderRadius: "12px" }}>
      <b>Tidak ada konektor yang cocok</b>
      <p style={{ margin: "8px 0 0", opacity: 0.75 }}>Ubah kata pencarian atau pilih kategori dan status lain.</p>
    </div>}
  </>;
}
