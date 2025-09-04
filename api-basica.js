// API Básica em JavaScript usando Express.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite requisições de qualquer origem
app.use(express.json()); // Para parsing de JSON no body das requisições

// Dados em memória (simulando um banco de dados)
let usuarios = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com' }
];

let proximoId = 4;

// Rota inicial - GET /
app.get('/', (req, res) => {
    res.json({
        mensagem: 'Bem-vindo à API Básica!',
        versao: '1.0.0',
        endpoints: {
            'GET /usuarios': 'Lista todos os usuários',
            'GET /usuarios/:id': 'Busca usuário por ID',
            'POST /usuarios': 'Cria novo usuário',
            'PUT /usuarios/:id': 'Atualiza usuário existente',
            'DELETE /usuarios/:id': 'Remove usuário'
        }
    });
});

// GET - Listar todos os usuários
app.get('/usuarios', (req, res) => {
    res.json({
        sucesso: true,
        dados: usuarios,
        total: usuarios.length
    });
});

// GET - Buscar usuário por ID
app.get('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado'
        });
    }
    
    res.json({
        sucesso: true,
        dados: usuario
    });
});

// POST - Criar novo usuário
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    
    // Validação básica
    if (!nome || !email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Nome e email são obrigatórios'
        });
    }
    
    // Verificar se email já existe
    const emailExiste = usuarios.find(u => u.email === email);
    if (emailExiste) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Email já está em uso'
        });
    }
    
    const novoUsuario = {
        id: proximoId++,
        nome,
        email
    };
    
    usuarios.push(novoUsuario);
    
    res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário criado com sucesso',
        dados: novoUsuario
    });
});

// PUT - Atualizar usuário existente
app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email } = req.body;
    
    const usuarioIndex = usuarios.findIndex(u => u.id === id);
    
    if (usuarioIndex === -1) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado'
        });
    }
    
    // Validação básica
    if (!nome || !email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Nome e email são obrigatórios'
        });
    }
    
    // Verificar se email já existe (exceto para o próprio usuário)
    const emailExiste = usuarios.find(u => u.email === email && u.id !== id);
    if (emailExiste) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Email já está em uso'
        });
    }
    
    usuarios[usuarioIndex] = {
        id,
        nome,
        email
    };
    
    res.json({
        sucesso: true,
        mensagem: 'Usuário atualizado com sucesso',
        dados: usuarios[usuarioIndex]
    });
});

// DELETE - Remover usuário
app.delete('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuarioIndex = usuarios.findIndex(u => u.id === id);
    
    if (usuarioIndex === -1) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado'
        });
    }
    
    const usuarioRemovido = usuarios.splice(usuarioIndex, 1)[0];
    
    res.json({
        sucesso: true,
        mensagem: 'Usuário removido com sucesso',
        dados: usuarioRemovido
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada'
    });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Acesse: http://localhost:${PORT}`);
    console.log(`📋 Documentação: http://localhost:${PORT}/`);
});

module.exports = app;

