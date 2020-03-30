// usando framework express para criar e configurar o servidor
const express = require("express")
const server = express()

const db = require('./db')

// const ideas = [
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729018.svg",
//         title: "Cursos de Programação",
//         category: "Estudo",
//         description: "Man Kind History ",
//         url: "http://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729069.svg",
//         title: "Exercícios",
//         category: "Atividade Física",
//         description: "Man Kind History",
//         url: "http://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729077.svg",
//         title: "Receitas para Cozinhar",
//         category: "Alimentação",
//         description: "Man Kind History ",
//         url: "http://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2728/2728968.svg",
//         title: "Brincadeiras",
//         category: "Diversão",
//         description: "Man Kind History ",
//         url: "http://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729021.svg",
//         title: "Jogar Video-Game",
//         category: "Diversão",
//         description: "Man Kind History ",
//         url: "http://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729040.svg",
//         title: "Reparar Itens",
//         category: "Consertos",
//         description: "Man Kind History ",
//         url: "http://www.google.com.br"
//     },
    
// ]

//configurar arquivos estáticos (css, scripts, imagem)
server.use(express.static("public"))

//habilitar uso do req.body

server.use(express.urlencoded({extended: true}));

//configurar nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views",{
    express: server,
    noCache: true,
})

//cria rota /
// captura o pedido do cliente para responder
server.get("/",function(req,res){

    
    db.all(`SELECT * FROM ideas`, function(err,rows){
        if(err){
            console.log(err);
            return res.send("Erro de Banco de Dados");
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reversedIdeas){
            if(lastIdeas.length < 3){
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideas: lastIdeas }) //,{title: h1})

        console.log(rows);
    });

    
})

server.get("/ideias", function(req,res){

    db.all(`SELECT * FROM ideas`, function(err,rows){
        if(err) {
            console.log(err);
            return res.send("Database Error!");
        }

        const reversedIdeas = [...rows].reverse();

        return res.render("ideias.html", { ideas: reversedIdeas })
    })

})

server.post(("/"), function(req,res){
    
    const query = `
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function(err){
         if(err){
             console.log(err);
             return res.send("Error on Database Access!");
         }
        
        //  console.log(this)

        return res.redirect("/ideias");
    });

})

//Servidor ligado na porta 3000 (locahost:3000)
server.listen(3000)