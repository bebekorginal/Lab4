const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`);
    next();
};

app.use(logger);
app.use(express.json());

let users = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Anna' }
];

app.get('/', (req, res) => {
    res.send('Witaj w aplikacji Express!');
});

// 1. POST - Tworzenie nowego użytkownika
app.post('/api/users', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Pole "name" jest wymagane!' });
    }

    const newUser = {
        id: users.length + 1,
        name: name
    };
    users.push(newUser);

    res.status(201).json(newUser);
});

// 2. PUT - Aktualizacja istniejącego użytkownika
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Pole "name" jest wymagane do aktualizacji!' });
    }

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: `Nie znaleziono użytkownika o ID ${id}` });
    }

    user.name = name;

    res.status(200).json({ message: 'Użytkownik zaktualizowany', user });
});

// 3. DELETE - Usuwanie użytkownika
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: `Nie znaleziono użytkownika o ID ${id}` });
    }

    users.splice(userIndex, 1);

    res.status(204).send(); 
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

app.get('/contact', (req, res) => {
    res.send('Kontakt')
});

app.get('/api/info', (req, res) => {
    res.json({
        application: 'Express LAB4',
        version: '1.0'
    });
});

app.get('/api/users/search', (req, res) => {
    const { name, page = 1 } = req.query;
    
    res.json({ name, page });
});

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        message: 'Pobrano użytkownika',
        id: id
    });
});

