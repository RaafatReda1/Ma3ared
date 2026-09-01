import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import styles from './PopupModal.module.css';

export const PopupModal = ({
  isOpen,
  onClose,
  type = 'info', // 'success' | 'error' | 'info'
  title,
  message,
  details,
  actionButton,
}) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );

        gsap.fromTo(
          modalRef.current,
          { scale: 0.8, opacity: 0, y: -20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.05 }
        );
      });

      return () => {
        document.body.style.overflow = 'auto';
        ctx.revert();
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className={`${styles.icon} ${styles.iconSuccess}`} size={42} />;
      case 'error':
        return <AlertTriangle className={`${styles.icon} ${styles.iconError}`} size={42} />;
      default:
        return <Info className={`${styles.icon} ${styles.iconInfo}`} size={42} />;
    }
  };

  return (
    <div className={styles.popupWrapper}>
      {/* Backdrop overlay fixed fullscreen */}
      <div
        ref={backdropRef}
        className={styles.backdrop}
        onClick={onClose}
      />

      {/* Fixed center modal card */}
      <div ref={modalRef} className={`${styles.modalCard} ${styles[type]}`}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        <div className={styles.iconWrapper}>{renderIcon()}</div>

        {title && <h3 className={styles.title}>{title}</h3>}
        {message && <p className={styles.message}>{message}</p>}

        {details && (
          <div className={styles.detailsBox}>
            {details}
          </div>
        )}

        <div className={styles.actionsGroup}>
          {actionButton ? (
            actionButton
          ) : (
            <button className={styles.primaryBtn} onClick={onClose}>
              حسناً، فهمت
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
