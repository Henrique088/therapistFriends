import lobo from './lobo.png';
import cadeado from './cadeado.svg';
import styles from './App.module.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <div className={styles.app}>
      <form className={styles.left}>
        <h1 className={styles.title}>Login</h1>
        <div className={styles.login_campo}>

          <span>@ E-mail</span>
          <input placeholder="Digite seu E-mail"></input>

          <div className={styles.senha}>
            <img src={cadeado} width="12px" heigth="12px"></img>
            <span className={styles.s}>Senha</span>
          </div>
        
          <input placeholder="Digite sua senha"></input>

        </div>
        
        <div className={styles.botao}>
          <button className={styles.logar}>Logar</button>
      
          
            
          <button className={styles.logar_google}> Logar com o Google</button>
          

        </div>

      

      </form>

      <div className={styles.right}>

        <img src={lobo} width="331" heigth="440" className={styles.lobo}></img>

        <span>Ainda não possui cadastro? <Link to="/cadastro">Cadastre-se</Link></span>

      </div>
      
      </div>
    </div>
  );
}

export default App;
