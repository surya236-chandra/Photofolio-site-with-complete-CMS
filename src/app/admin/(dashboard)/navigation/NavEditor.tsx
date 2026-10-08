"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Layers } from "lucide-react";
import type { NavItem, FooterColumn } from "@/lib/settings";
import { saveNavigationAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/ui";

type Suggestion = { label: string; href: string };

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export default function NavEditor({
  initialHeader,
  initialFooter,
  suggestions,
}: {
  initialHeader: NavItem[];
  initialFooter: FooterColumn[];
  suggestions: Suggestion[];
}) {
  const [header, setHeader] = useState<NavItem[]>(initialHeader);
  const [footer, setFooter] = useState<FooterColumn[]>(initialFooter);

  // ---- header mutations ----
  const setItem = (i: number, patch: Partial<NavItem>) =>
    setHeader((h) => h.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const addItem = () =>
    setHeader((h) => [...h, { label: "New link", href: "/", children: [] }]);
  const removeItem = (i: number) => setHeader((h) => h.filter((_, idx) => idx !== i));
  const moveItem = (i: number, d: -1 | 1) => setHeader((h) => move(h, i, d));

  const addGroup = (i: number) =>
    setItem(i, { children: [...header[i].children, { heading: "Group", links: [{ label: "Link", href: "/" }] }] });
  const removeGroup = (i: number, gi: number) =>
    setItem(i, { children: header[i].children.filter((_, idx) => idx !== gi) });
  const setGroup = (i: number, gi: number, patch: Partial<{ heading: string }>) =>
    setItem(i, { children: header[i].children.map((g, idx) => (idx === gi ? { ...g, ...patch } : g)) });

  const addGroupLink = (i: number, gi: number) =>
    setItem(i, {
      children: header[i].children.map((g, idx) =>
        idx === gi ? { ...g, links: [...g.links, { label: "Link", href: "/" }] } : g
      ),
    });
  const setGroupLink = (i: number, gi: number, li: number, patch: Partial<{ label: string; href: string }>) =>
    setItem(i, {
      children: header[i].children.map((g, idx) =>
        idx === gi ? { ...g, links: g.links.map((l, k) => (k === li ? { ...l, ...patch } : l)) } : g
      ),
    });
  const removeGroupLink = (i: number, gi: number, li: number) =>
    setItem(i, {
      children: header[i].children.map((g, idx) =>
        idx === gi ? { ...g, links: g.links.filter((_, k) => k !== li) } : g
      ),
    });

  // ---- footer mutations ----
  const setCol = (ci: number, patch: Partial<FooterColumn>) =>
    setFooter((f) => f.map((c, idx) => (idx === ci ? { ...c, ...patch } : c)));
  const addCol = () => setFooter((f) => [...f, { title: "Column", links: [{ label: "Link", href: "/" }] }]);
  const removeCol = (ci: number) => setFooter((f) => f.filter((_, idx) => idx !== ci));
  const moveCol = (ci: number, d: -1 | 1) => setFooter((f) => move(f, ci, d));
  const addColLink = (ci: number) => setCol(ci, { links: [...footer[ci].links, { label: "Link", href: "/" }] });
  const setColLink = (ci: number, li: number, patch: Partial<{ label: string; href: string }>) =>
    setCol(ci, { links: footer[ci].links.map((l, k) => (k === li ? { ...l, ...patch } : l)) });
  const removeColLink = (ci: number, li: number) =>
    setCol(ci, { links: footer[ci].links.filter((_, k) => k !== li) });

  const HrefInput = (props: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <>
      <input
        list="nav-suggestions"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder || "/path or https://"}
        className="input"
      />
    </>
  );

  return (
    <form
      action={saveNavigationAction}
      className="space-y-8"
    >
      <input type="hidden" name="nav" value={JSON.stringify({ header, footer })} />
      <datalist id="nav-suggestions">
        {suggestions.map((s) => (
          <option key={s.href} value={s.href}>{s.label}</option>
        ))}
      </datalist>

      {/* HEADER */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="display text-xl font-bold">Header menu</h2>
            <p className="text-sm text-muted">Top-bar links. Add groups to a link to turn it into a dropdown / mega menu.</p>
          </div>
          <button type="button" onClick={addItem} className="btn btn-accent !py-2"><Plus size={16} /> Add link</button>
        </div>

        <div className="space-y-4">
          {header.map((item, i) => (
            <div key={i} className="surface p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="label">Label</label>
                  <input value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} className="input" />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="label">Link</label>
                  <HrefInput value={item.href} onChange={(v) => setItem(i, { href: v })} />
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveItem(i, -1)} className="btn btn-ghost !px-2 !py-2" title="Move up"><ChevronUp size={16} /></button>
                  <button type="button" onClick={() => moveItem(i, 1)} className="btn btn-ghost !px-2 !py-2" title="Move down"><ChevronDown size={16} /></button>
                  <button type="button" onClick={() => removeItem(i)} className="btn btn-ghost !px-2 !py-2 !text-red-500" title="Remove"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* Dropdown / mega menu groups */}
              <div className="mt-4 space-y-3 border-t border-line pt-4">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Layers size={15} /> Dropdown columns {item.children.length === 0 && "(none — this is a simple link)"}
                  </p>
                  <button type="button" onClick={() => addGroup(i)} className="btn btn-ghost !py-1.5 text-sm"><Plus size={14} /> Add column</button>
                </div>

                {item.children.map((group, gi) => (
                  <div key={gi} className="rounded-[var(--radius)] bg-surface2 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={group.heading}
                        onChange={(e) => setGroup(i, gi, { heading: e.target.value })}
                        placeholder="Column heading"
                        className="input flex-1 !bg-bg"
                      />
                      <button type="button" onClick={() => removeGroup(i, gi)} className="btn btn-ghost !px-2 !py-2 !text-red-500"><Trash2 size={15} /></button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {group.links.map((l, li) => (
                        <div key={li} className="flex items-center gap-2">
                          <input value={l.label} onChange={(e) => setGroupLink(i, gi, li, { label: e.target.value })} placeholder="Label" className="input !bg-bg" />
                          <input list="nav-suggestions" value={l.href} onChange={(e) => setGroupLink(i, gi, li, { href: e.target.value })} placeholder="/path" className="input !bg-bg" />
                          <button type="button" onClick={() => removeGroupLink(i, gi, li)} className="shrink-0 text-muted hover:text-red-500"><Trash2 size={15} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addGroupLink(i, gi)} className="text-sm text-accent hover:underline">+ Add link</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {header.length === 0 && <p className="text-muted">No header links yet.</p>}
        </div>
      </section>

      {/* FOOTER */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="display text-xl font-bold">Footer columns</h2>
            <p className="text-sm text-muted">Grouped link columns shown in the footer.</p>
          </div>
          <button type="button" onClick={addCol} className="btn btn-accent !py-2"><Plus size={16} /> Add column</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {footer.map((col, ci) => (
            <div key={ci} className="surface p-4">
              <div className="flex items-center gap-2">
                <input value={col.title} onChange={(e) => setCol(ci, { title: e.target.value })} placeholder="Column title" className="input flex-1" />
                <button type="button" onClick={() => moveCol(ci, -1)} className="btn btn-ghost !px-2 !py-2" title="Move up"><ChevronUp size={16} /></button>
                <button type="button" onClick={() => moveCol(ci, 1)} className="btn btn-ghost !px-2 !py-2" title="Move down"><ChevronDown size={16} /></button>
                <button type="button" onClick={() => removeCol(ci)} className="btn btn-ghost !px-2 !py-2 !text-red-500"><Trash2 size={16} /></button>
              </div>
              <div className="mt-3 space-y-2">
                {col.links.map((l, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <input value={l.label} onChange={(e) => setColLink(ci, li, { label: e.target.value })} placeholder="Label" className="input !bg-surface2" />
                    <input list="nav-suggestions" value={l.href} onChange={(e) => setColLink(ci, li, { href: e.target.value })} placeholder="/path" className="input !bg-surface2" />
                    <button type="button" onClick={() => removeColLink(ci, li)} className="shrink-0 text-muted hover:text-red-500"><Trash2 size={15} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addColLink(ci)} className="text-sm text-accent hover:underline">+ Add link</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <SubmitButton className="btn btn-accent shadow-xl">Save navigation</SubmitButton>
      </div>
    </form>
  );
}
