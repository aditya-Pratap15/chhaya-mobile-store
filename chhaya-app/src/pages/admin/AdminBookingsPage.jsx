import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Calendar, Trash2, CheckCircle2, Clock, Wrench,
  Phone, Smartphone, MessageCircle, XCircle
} from "lucide-react";

const STATUS_STYLES = {
  pending:   { label: "Pending",   bg: "bg-amber-100",   text: "text-amber-800",   icon: Clock },
  confirmed: { label: "Confirmed", bg: "bg-blue-100",    text: "text-blue-800",    icon: CheckCircle2 },
  completed: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", bg: "bg-rose-100",    text: "text-rose-800",    icon: XCircle }
};
const CHANNEL_STYLES = {
  "Web Form": { bg: "bg-blue-50", text: "text-blue-700" },
  "WhatsApp": { bg: "bg-emerald-50", text: "text-emerald-700" }
};

export default function AdminBookingsPage() {
  const { bookings, updateBookingStatus, deleteBooking, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = filterStatus === "all" ? bookings : bookings.filter(b => b.status === filterStatus);
  const counts = {
    all: bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove booking for "${name}"?`)) deleteBooking(id);
  };

  const handleWhatsApp = (bk) => {
    const phone = bk.customerPhone?.replace(/[^0-9]/g, "");
    if (!phone) { showToast("No phone number on this booking.", "error"); return; }
    const msg = encodeURIComponent(
      `Hello ${bk.customerName}, this is Chhaya Mobiles (Chitrakoot Dham). ` +
      `Your bench reservation for *${bk.serviceName}* (${bk.deviceBrand} ${bk.deviceModel}) ` +
      `slot *${bk.preferredSlot}* is *confirmed*. ` +
      `Walk in at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. Thank you!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-8 text-left max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">Live Reservation Inbox</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Diagnostic Bench Bookings</h1>
          <p className="text-xs text-slate-500">All customer bench reservations submitted via the storefront.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800">{counts.pending} Pending</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800">{counts.confirmed} Confirmed</span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">{counts.completed} Done</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {["all","pending","confirmed","completed","cancelled"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === s ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} <span className="ml-1 opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Bookings Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {filterStatus === "all" ? "Bench reservations will appear here automatically." : `No ${filterStatus} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(bk => {
            const ss = STATUS_STYLES[bk.status] || STATUS_STYLES.pending;
            const StatusIcon = ss.icon;
            const cs = CHANNEL_STYLES[bk.channel] || { bg: "bg-slate-50", text: "text-slate-700" };
            return (
              <div key={bk.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-all">
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900">{bk.customerName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${ss.bg} ${ss.text} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />{ss.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cs.bg} ${cs.text}`}>{bk.channel || "Web"}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <Phone className="w-3 h-3 inline mr-1" />{bk.customerPhone}
                      {bk.createdAt && <span className="ml-3 opacity-70">• {bk.createdAt}</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-blue-600" />{bk.deviceBrand} {bk.deviceModel}</span>
                    <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-indigo-600" />{bk.serviceName}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-600" />{bk.preferredSlot}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {bk.servicePrice && <span>Starting Rs.{Number(bk.servicePrice).toLocaleString("en-IN")}</span>}
                    {bk.serviceDuration && <span>{bk.serviceDuration}</span>}
                    {bk.serviceWarranty && <span>{bk.serviceWarranty} warranty</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                  {bk.status === "pending" && (
                    <button onClick={() => updateBookingStatus(bk.id, "confirmed")}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                    </button>
                  )}
                  {bk.status === "confirmed" && (
                    <button onClick={() => updateBookingStatus(bk.id, "completed")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}
                  {(bk.status === "pending" || bk.status === "confirmed") && (
                    <button onClick={() => updateBookingStatus(bk.id, "cancelled")}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                  <button onClick={() => handleWhatsApp(bk)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button onClick={() => handleDelete(bk.id, bk.customerName)}
                    className="p-1.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200" title="Remove">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
