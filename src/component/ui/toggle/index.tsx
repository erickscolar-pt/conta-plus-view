import React, { ChangeEvent } from 'react';
import styles from './styles.module.scss';

interface Toggle {
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Toggle({ checked, onChange }: Toggle) {
    return (
        <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e)} />
            <span className={styles.toggleSlider}></span>
        </label>

    );
}
