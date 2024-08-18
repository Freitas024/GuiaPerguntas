const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 2409;
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
//database

connection.authenticate()
    .then(() => {
        console.log("conexão feita com banco de dados!");
    })
    .catch((msgError) => {
        console.log(msgError);
    })    

//Mandando o Express usar o EJS como View engine.
app.set('view engine', 'ejs');
app.use(express.static('public'));

//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurando o diretorio de views.
app.set('views', path.join(__dirname, 'views'));

// ROTAS
// Rota para renderizar a view "index.ejs"
app.get("/",(req, res) => {
    Pergunta.findAll({raw: true, order: [
        ['id','DESC'] // 'ASC' = Crescente || 'DESC' = Decrescente
    ]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    });
});


app.get("/pergunta/:id", (req, res) => {

    var id = req.params.id;

    Pergunta.findOne({
        where: {id: id} //"where" serve para fazer condições.
    }).then(pergunta => {
        if(pergunta != undefined) { //pergunta encontrada
            res.render("pergunta");
        }else {// não encontrada
            res.redirect("/");
        }
    });
});


//iniciando o servidor
app.listen(port, ()=> {
    console.log(`Site rodando na porta ${port}`);
});