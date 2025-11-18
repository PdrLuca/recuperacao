import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Clínica Reabilitar</h1>
      <p>Bem-vindo(a) à melhor clínica de fisioterapia da região!</p>
      <Link
        to="/agendamento"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#0066ff",
          color: "white",
          borderRadius: "5px",
          textDecoration: "none",
          marginTop: "20px"
        }}
      >
        Agendar Consulta
      </Link>
    </div>
  );
}
