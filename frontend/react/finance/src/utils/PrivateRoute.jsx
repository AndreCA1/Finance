import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // ou 'authToken', conforme você salvou

  // Se não houver token, redireciona para login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se tiver token, mostra o conteúdo protegido
  return children;
}
