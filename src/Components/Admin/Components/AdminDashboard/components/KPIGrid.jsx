import React from "react";
import { Users, CheckCircle2, Clock, XCircle, Sparkles, ShieldCheck } from "lucide-react";
import KPICard from "./KPICard";
import styles from "../AdminDashboard.module.css";

const KPIGrid = ({ kpis = {}, loading = false }) => {
  return (
    <div className={styles.kpiGrid}>
      {/* 1. Total Registrations */}
      <KPICard
        title="إجمالي المسجلين"
        value={kpis.total}
        icon={<Users size={22} />}
        color="gold"
        subtext="العدد الكلي للطلبات المسجلة"
        loading={loading}
      />

      {/* 2. Approved */}
      <KPICard
        title="المقبولين والمعتمدين"
        value={kpis.approved}
        icon={<CheckCircle2 size={22} />}
        color="emerald"
        badge={`${kpis.approvedRate || 0}%`}
        subtext="تمت مراجعتهم واعتماد بطاقاتهم"
        loading={loading}
      />

      {/* 3. Pending Review */}
      <KPICard
        title="قيد المراجعة"
        value={kpis.pending}
        icon={<Clock size={22} />}
        color="amber"
        badge={`${kpis.total > 0 ? Math.round((kpis.pending / kpis.total) * 100) : 0}%`}
        subtext="طلبات جديدة بانتظار الموافقة"
        loading={loading}
      />

      {/* 4. Rejected */}
      <KPICard
        title="الطلبات المرفوضة"
        value={kpis.rejected}
        icon={<XCircle size={22} />}
        color="rose"
        subtext="طلبات غير مقبولة أو ملغاة"
        loading={loading}
      />

      {/* 5. First Time Attendees */}
      <KPICard
        title="حضور لأول مرة"
        value={kpis.firstTime}
        icon={<Sparkles size={22} />}
        color="cyan"
        badge={`${kpis.firstTimeRate || 0}%`}
        subtext="مشاركون جدد في معارض مدينة نصر"
        loading={loading}
      />

      {/* 6. Verified Google Accounts */}
      <KPICard
        title="حسابات موثقة (Google)"
        value={kpis.verified}
        icon={<ShieldCheck size={22} />}
        color="purple"
        subtext="مسجلون مسجل دخولهم بحساب Google"
        loading={loading}
      />
    </div>
  );
};

export default KPIGrid;
