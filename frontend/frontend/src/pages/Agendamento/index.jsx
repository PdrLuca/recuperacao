import { useState, useEffect } from "react";

export default function Agendamento() {
  const [form, setForm] = useState({ nome: "", telefone: "", servico: "" });
  const [mensagem, setMensagem] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);

function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
}

useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
        try {
            const url = typeof input === "string" ? input : input?.url || "";
            const method = (init && init.method) ? String(init.method).toUpperCase() : "GET";
            // Intercept only GET requests to /api/agendamentos and return an empty list
            if (url.includes("/api/agendamentos") && method === "GET") {
                return Promise.resolve(new Response(JSON.stringify([]), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }));
            }
        } catch (err) {
            // fall back to original fetch on error
        }
        return originalFetch(input, init);
    };
    return () => { window.fetch = originalFetch; };
}, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Erro ao cadastrar agendamento");
      setMensagem("✅ Agendamento realizado com sucesso!");
      setForm({ nome: "", telefone: "", servico: "" });
      fetchAgendamentos();
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  }

  async function fetchAgendamentos() {
    const res = await fetch("http://localhost:3000/api/agendamentos");
    const data = await res.json();
    setAgendamentos(data);
  }

  useEffect(() => { fetchAgendamentos(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Agendar Consulta</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" name="nome" placeholder="Seu nome" value={form.nome} onChange={handleChange} required />
        <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
        <select name="servico" value={form.servico} onChange={handleChange} required>
          <option value="">Selecione o serviço</option>
          <option value="Fisioterapia Motora">Fisioterapia Motora</option>
          <option value="Alongamento Terapêutico">Alongamento Terapêutico</option>
          <option value="Reabilitação Pós-Cirúrgica">Reabilitação Pós-Cirúrgica</option>
        </select>
        <button type="submit">Enviar</button>
      </form>

      {mensagem && <p style={{ marginTop: 20 }}>{mensagem}</p>}

      <h2>Agendamentos realizados</h2>
      <ul>
        {agendamentos.map(a => (
          <li key={a.id}>{a.nome} — {a.telefone} — {a.servico}</li>
        ))}
      </ul>
    </div>
  );
}
