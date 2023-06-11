const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'banco', //nome do service e do container no docker compose
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

const sql = `INSERT INTO people(name) values('Pedro')`
connection.query(sql)

getPeople = function () {
    return new Promise(function (resolve, reject) {
        const people = "select distinct name from people;"
        connection.query(
            people,
            function (err, rows) {
                if (err) {
                    reject(new Error("ERRO: "+ err));
                } else {
                    resolve(rows);
                }
            }
        )
    }
    )
}

getPeople()
    .then(function (results) {
        app.get('/', (req, res) => {
            html = '<h1>Full Cyclee!</h1>'
            html += '<h2>'+results.length+' pessoas</h2>'
            html += "<ul>"
          for (var i in results) html += "<li>" + results[i].name + "</li>";
          html += "</ul>"
            res.send(html)
        })
    })
    .catch(function (err) {
        console.log("Promise rejection error: " + err);
    })
connection.end()


app.listen(port, () => {
    console.log('Rodando na porta: ' + port)
})

