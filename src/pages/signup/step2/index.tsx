import styles from './styles.module.scss';
import { toast } from 'react-toastify';

export default function Step2({ userData, setUserData, nextStep, prevStep }) {

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNext = () => {
    if (!isPasswordValid(userData.password)) {

      toast.warning('A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (userData.password !== userData.confirmPassword) {
      toast.warning('As senhas não coincidem.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.information}>
          <span>Senha</span>
          <h1>Agora, crie uma senha</h1>
          <span>Crie uma senha forte e garanta segurança para sua conta</span>
        </div>

        <div className={styles.senha}>
          <span>Digite a senha</span>
          <input
            type="password"
            placeholder="Senha"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </div>

        <div className={styles.senha}>
          <span>Repita a senha</span>
          <input
            type="password"
            placeholder="Confirme a senha"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
          />
        </div>
        <div className={styles.dica}>
          <span>Dica para a sua senha:</span> ela deve conter no mínimo 8 caracteres, sendo ao menos 1 letra maiúscula, 1 número e 1 caractere especial.
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handlePrevious}>Voltar</button>
        <button onClick={handleNext}>Avançar</button>
      </div>
    </div>
  );
}
