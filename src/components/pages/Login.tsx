import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Login.scss";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o Google");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validação de formato no Login
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(
        "Por favor, insira um formato de e-mail válido para entrar (ex: nome@dominio.com).",
      );
      setLoading(false);
      return;
    }

    if (password.length === 0) {
      setError("O campo de senha não pode estar vazio.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      window.location.href = "/dashboard";
    } catch (err: any) {
      // Tratamento de Respostas do Servidor
      if (err.message === "Invalid login credentials") {
        setError(
          "E-mail ou senha incorretos. Verifique os dados e tente novamente.",
        );
      } else if (err.message === "Email not confirmed") {
        setError(
          "Este e-mail ainda não foi confirmado. Verifique sua caixa de entrada.",
        );
      } else {
        setError(err.message || "Erro ao tentar realizar o login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">Entrar no Sistema</h2>
        <p className="subtitle">Demonstração prática de JWT & OAuth2</p>

        {error && <div className="error-box">{error}</div>}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-btn"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
          />
          {loading ? "Carregando..." : "Continuar com o Google"}
        </button>

        <div className="divider">
          <span className="divider-text">ou use seu e-mail</span>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="toggle-text">
          Não tem uma conta?{" "}
          <Link to="/register" className="toggle-link">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};
