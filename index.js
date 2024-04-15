const express = require('express');
const app = express();

//connect to db
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database'
});
connection.connect();
connection.query('select * from account', (err, data) => {
    if (err) throw err;

    console.log();
});
//end

const port = 3000;

const bodyParser = require('body-parser');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));


// app.get("/", (req, res) => {
//     //res.send("Hello");
//     let person = req.body;
//     res.render("index", { person: person });
// });

app.post('/submit', (req, res) => {
    let person = req.body;
    res.render("index", { person: person });
});

//login
app.get('/', (req, res) => {
    res.render('loginForm');
})
app.post('/login', (req, res) => {
    

    var username = req.body.name;
    var password = req.body.password;
    var query = `
        select * from account 
        where name = '${username}' and password = '${password}'
    `;

    connection.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        else {
            
            res.redirect('/manage');
        }
    })
});

// display account
app.get('/manage', (req, res) => {
    const query = 'select * from account';

    connection.query(query, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.render('accountManagement', { title: 'Welcome to account management', action: 'manage', data: data });
        }
    });
});

//insert account
app.get('/manage/add', (req, res) => {
    res.render('accountManagement', { title: 'Insert data in mysql', action: 'add' });
});

app.post('/manage/add', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phone = req.body.phone;
    var image = req.body.image;
    var createdAt = req.body.createdAt;

    var query = `
        insert into account
        (name, email, password, phone, image, createdAt)
        values('${name}', '${email}', '${password}', '${phone}', '${image}', '${createdAt}')
    `;

    connection.query(query, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.redirect('/manage');
        }
    });
});
//end

//Update
app.get('/manage/edit/:id', (req, res) => {

    var id = req.params.id;

    var query = `select * from  account where id = '${id}'`;

    connection.query(query, (err, data) => {
        if (err) throw err;
        res.render('accountManagement', { title: 'Edit Account', action: 'edit', data: data[0] });
    });
});


app.post('/manage/edit/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let image = req.body.image;
    let createdAt = req.body.createdAt;

    console.log(req.body);
    
    let query = `
    update account
    set name = '${name}',
        email = '${email}',
        password = '${password}',
        phone = '${phone}',
        image = '${image}',
        createdAt = '${createdAt}'
    where id = '${id}'
    `;

    connection.query(query, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.redirect('/manage');
        }
    });
});

//Delete
app.get('/manage/delete/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    let query = `delete from account where id  = '${id}'`;

    connection.query(query, (err, result) => {
        if (err) {
            res.send({
                'code': 400,
                'faild': 'error ocurred'
            });
        } else {
            console.log('deleted ' + result.affectedRows + ' rows');
            res.redirect('/manage');
        }
    });
});
//
app.listen(port, () => {
    console.log(`App running at port: ${port}`);
});