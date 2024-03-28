import React, { useState } from 'react';
import styles from './styles.module.scss'; // Importe o arquivo de estilos CSS

export default function Modal ({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
};