import { useContext, useState } from 'react';
import styles from './styles.module.scss'


export default function Step3({ userData, setUserData, handleFormSubmit, prevStep }) {
  const handlePrevious = () => {
    prevStep();
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.information}>
          <span>Código de Indicação</span>
          <h1>Chegou aqui por Indicação</h1>
          <span>Insira o código de Indicação no campo abaixo</span>
        </div>

        <div className={styles.senha}>
          <span>Código de Indicação</span>
          <input
            type="text"
            placeholder="Código de Indicação"
            value={userData.referralCode}
            onChange={(e) => setUserData({ ...userData, referralCode: e.target.value })}
          />
          <span className={styles.info}>Esta etapa não é obrigatória</span>
        </div>
      </div>



      <div className={styles.buttonContainer}>
        <button onClick={handlePrevious}>Voltar</button>
        <button onClick={handleFormSubmit}>Finalizar</button>
      </div>

    </div>
  );
}
