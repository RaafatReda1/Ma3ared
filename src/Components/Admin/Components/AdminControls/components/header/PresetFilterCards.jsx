import React from "react";
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import styles from "../../AdminControls.module.css";

const PresetFilterCards = ({
  presetFilter = "all",
  onSelectPreset,
  presetCounts = {},
}) => {
  const cards = [
    {
      key: "all",
      title: "جميع المسجلين",
      count: presetCounts.all || 0,
      icon: <Users size={16} className="text-amber-400" />,
      badgeClass: styles.presetBadgeDefault,
    },
    {
      key: "pending",
      title: "قيد المراجعة",
      count: presetCounts.pending || 0,
      icon: <Clock size={16} className="text-amber-500" />,
      badgeClass: styles.presetBadgePending,
    },
    {
      key: "today",
      title: "مسجلي اليوم",
      count: presetCounts.today || 0,
      icon: <Calendar size={16} className="text-sky-400" />,
      badgeClass: styles.presetBadgeToday,
    },
    {
      key: "approved",
      title: "المقبولين",
      count: presetCounts.approved || 0,
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      badgeClass: styles.presetBadgeApproved,
    },
    {
      key: "rejected",
      title: "المرفوضين",
      count: presetCounts.rejected || 0,
      icon: <XCircle size={16} className="text-rose-400" />,
      badgeClass: styles.presetBadgeRejected,
    },
    {
      key: "first_time",
      title: "حضور لأول مرة",
      count: presetCounts.first_time || 0,
      icon: <Sparkles size={16} className="text-cyan-400" />,
      badgeClass: styles.presetBadgeCyan,
    },
  ];

  return (
    <div className={styles.presetGrid}>
      {cards.map((c) => (
        <div
          key={c.key}
          className={`${styles.presetCard} ${
            presetFilter === c.key ? styles.activePreset : ""
          }`}
          onClick={() => onSelectPreset(c.key)}
        >
          <div className={styles.presetLeft}>
            {c.icon}
            <span className={styles.presetTitle}>{c.title}</span>
          </div>
          <span className={`${styles.presetBadge} ${c.badgeClass}`}>
            {c.count}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PresetFilterCards;
