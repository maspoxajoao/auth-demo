import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./Dashboard.scss";

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const userMetadata = user?.user_metadata;
  const userName = userMetadata?.full_name || user?.email?.split("@")[0];
  const userAvatar =
    userMetadata?.avatar_url || "https://via.placeholder.com/150";

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div className="logo">
          AuthFlow <span>Insights</span>
        </div>
        {user && (
          <div className="user-profile">
            <img src={userAvatar} alt="Avatar" className="avatar" />
            <div className="user-info">
              <span className="name">Olá, {userName}!</span>
              <span className="email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="dash-content">
        <article className="post-article">
          <span className="badge">Acesso Concedido via JWT</span>
          <h1>
            Como funciona a Autenticação Moderna: Tokens JWT e OAuth2 com Google
          </h1>

          <p className="intro">
            Se você está vendo esta tela, parabéns! O seu navegador acabou de
            receber um
            <strong> JSON Web Token (JWT)</strong> criptografado que serviu como
            o seu crachá de acesso para esta rota protegida.
          </p>
          <hr />
          <section className="topic">
            <h2>1. O que aconteceu quando você clicou em "Entrar"?</h2>
            <p>
              Ao escolher o login pelo <strong>Google (OAuth2)</strong>, o nosso
              Front-end redirecionou você para os servidores seguros da Google.
              Após sua autorização, a Google devolveu uma prova de identidade
              para o nosso provedor de autenticação, que validou seus dados e
              gerou um token JWT local.
            </p>
            <p>
              Caso tenha criado uma conta tradicional, a sua senha passou por
              uma validação estrita no Front-end via{" "}
              <strong>Regex (Expressões Regulares)</strong>, garantindo que
              senhas fracas sequer chegassem ao servidor, economizando
              processamento e reforçando a segurança na ponta.
            </p>
          </section>
          <section className="topic">
            <h2>2. O papel do JWT nas Rotas Protegidas</h2>
            <p>
              Diferente dos sistemas antigos baseados em Sessões (onde o
              servidor precisa lembrar de cada usuário conectado gastando
              memória), o JWT é <strong>stateless</strong> (sem estado). Ele
              fica guardado no seu navegador e, toda vez que você tenta acessar
              uma página interna como esta, o nosso middleware (Route Guard) lê
              a assinatura desse token. Se ela for válida e não tiver expirado,
              o acesso é liberado instantaneamente.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};
