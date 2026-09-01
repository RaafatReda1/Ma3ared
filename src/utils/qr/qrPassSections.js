import { loadImage, roundRect } from "./qrHelpers";

// ─── 5. Header ────────────────────────────────────────────────────────
export const drawHeader = async (ctx, width) => {
  ctx.textAlign = "center";
  ctx.fillStyle = "#df9c4c";
  ctx.font = "bold 16px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("معارض ملابس - رسالة - مدينة نصر", width / 2, 48);

  const ma3aredLogo = await loadImage("/logoMa3ared.png");
  if (ma3aredLogo) {
    ctx.drawImage(ma3aredLogo, (width - 120) / 2, 58, 120, 80);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("حفلة معارض مدينة نصر", width / 2, 105);
  }

  ctx.fillStyle = "#f5d89a";
  ctx.font = "600 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("بطاقة الدخول الرسمية للفعالية | Official Event Pass", width / 2, 154);
};

// ─── 6. QR Card ───────────────────────────────────────────────────────
export const drawQrCard = (ctx, qrCanvas, width) => {
  const cardX    = (width - 290) / 2;
  const cardY    = 174;
  const cardSize = 290;

  ctx.save();
  ctx.shadowColor   = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur    = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth   = 2;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 20);
  ctx.stroke();

  ctx.drawImage(qrCanvas, cardX + 15, cardY + 15, 260, 260);
  return { cardX, cardY, cardSize };
};

// ─── 7. Activity Logo (QR Center Overlay) ─────────────────────────────
export const drawLogoOverlay = async (ctx, cardX, cardY, cardSize) => {
  const logo = await loadImage("/logoMa3ared.png");
  const size = 56;
  const cx   = cardX + (cardSize - size) / 2;
  const cy   = cardY + (cardSize - size) / 2;

  // White badge background + gold border
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cx - 3, cy - 3, size + 6, size + 6, 12);
  ctx.fill();
  ctx.strokeStyle = "#df9c4c";
  ctx.lineWidth   = 2;
  roundRect(ctx, cx - 3, cy - 3, size + 6, size + 6, 12);
  ctx.stroke();

  if (logo) {
    ctx.save();
    roundRect(ctx, cx, cy, size, size, 10);
    ctx.clip();
    ctx.drawImage(logo, cx, cy, size, size);
    ctx.restore();
  } else {
    ctx.fillStyle = "#df9c4c";
    roundRect(ctx, cx, cy, size, size, 10);
    ctx.fill();
  }
};

// ─── 8. Student Info ───────────────────────────────────────────────────
export const drawStudentInfo = (ctx, width, studentName, studentUniv, studentYear, displayId) => {
  const infoY = 490;

  ctx.fillStyle = "#ffffff";
  ctx.font      = "bold 24px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(studentName || "المشارك", width / 2, infoY);

  const details = [studentUniv, studentYear].filter(Boolean);
  if (details.length > 0) {
    ctx.fillStyle = "#94a3b8";
    ctx.font      = "bold 15px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText(details.join(" • "), width / 2, infoY + 30);
  }

  // ID Pill Badge
  const pillW = 200;
  const pillH = 46;
  const pillX = (width - pillW) / 2;
  const pillY = infoY + (details.length > 0 ? 46 : 24);

  ctx.fillStyle = "rgba(11, 35, 70, 0.8)";
  roundRect(ctx, pillX, pillY, pillW, pillH, 12);
  ctx.fill();
  ctx.strokeStyle = "#df9c4c";
  ctx.lineWidth   = 1.5;
  roundRect(ctx, pillX, pillY, pillW, pillH, 12);
  ctx.stroke();

  ctx.fillStyle = "#df9c4c";
  ctx.font      = "bold 11px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("الرقم التعريفي للمشارك", width / 2, pillY + 16);

  ctx.fillStyle = "#ffffff";
  ctx.font      = "bold 14px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText(displayId, width / 2, pillY + 36);
};

// ─── 9. Verification Box ──────────────────────────────────────────────
export const drawVerificationBox = (ctx, width) => {
  const boxY = 620;
  const boxW = width - 100;
  const boxH = 90;
  const boxX = 50;

  ctx.fillStyle = "rgba(4, 6, 17, 0.6)";
  roundRect(ctx, boxX, boxY, boxW, boxH, 14);
  ctx.fill();

  ctx.strokeStyle = "rgba(223, 156, 76, 0.35)";
  ctx.lineWidth   = 1;
  roundRect(ctx, boxX, boxY, boxW, boxH, 14);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#22c55e";
  ctx.font      = "bold 14px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("✓ بطاقة معتمدة ومسجلة رسمياً", width / 2, boxY + 28);

  ctx.fillStyle = "#cbd5e1";
  ctx.font      = "12px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("الجمعة 4 سبتمبر 2026 - الساعة 01:00 ظهرًا", width / 2, boxY + 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font      = "11px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("يرجى إبراز هذا الرمز عند بوابة الدخول للتحقق السريع", width / 2, boxY + 74);
};

// ─── 10. Footer ───────────────────────────────────────────────────────
export const drawFooter = (ctx, width) => {
  ctx.textAlign = "center";
  ctx.fillStyle = "#64748b";
  ctx.font      = "11px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("معارض مدينة نصر 2026 — رسالة للخير دايماً عنوان", width / 2, 750);
};
