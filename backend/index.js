const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Conexão com MySQL
const sequelize = new Sequelize('db_recu', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Modelo Agendamento
const Agendamento = sequelize.define('Agendamento', {
    nome: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING, allowNull: false },
    servico: { type: DataTypes.STRING, allowNull: false }
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Teste da API
app.get('/', (req, res) => {
    res.send('API de Agendamentos funcionando!');
});

// Criar agendamento
app.post('/api/agendamentos', async (req, res) => {
    try {
        const { nome, telefone, servico } = req.body;
        const novoAgendamento = await Agendamento.create({ nome, telefone, servico });
        res.status(201).json(novoAgendamento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Listar agendamentos
app.get('/api/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll();
        res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Sincronizar e iniciar servidor
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco:', err);
});
