var express = require('express');
var router = express.Router();
const path = require('path');
const sqlite3 = require("sqlite3").verbose();
require('dotenv').config()
/*Creacion de la Base de Datos*/
const dbRoot = path.join(__dirname, "/bd", "dbAdmin.db");
const dbAdmin = new sqlite3.Database(dbRoot, (err) => {
  let question = err ? err : 'database success';
  console.log(question);
});

const category = "CREATE TABLE categorias (id INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL);";
const products = "CREATE TABLE productos (id INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL,codigo TEXT NOT NULL,precio NUMERIC NOT NULL,descripcion TEXT NOT NULL,categoria_id INTEGER NOT NULL,pantalla TEXT NOT NULL,procesador TEXT NOT NULL,FOREIGN KEY (categoria_id) REFERENCES categorias (id))";
const images = "CREATE TABLE imagenes (id INTEGER PRIMARY KEY AUTOINCREMENT,producto_id INTEGER NOT NULL,url TEXT NOT NULL,destacado BOOLEAN NOT NULL,FOREIGN KEY (producto_id) REFERENCES productos (id));"

dbAdmin.run(category, (err) => {
  if (err) {

  }
})

dbAdmin.run(products, (err) => {
  let question = err ? err : 'success table products';
  console.log(question)
})

dbAdmin.run(images, (err) => {
  let question = err ? err : 'success table images';
  console.log(question)
})

/*=================================*/


/*Vistas*/

router.get('/', function (req, res, next) {
  res.render('index');
});



router.get('/interfaz', (req, res) => {
  const sql = "SELECT * FROM categorias";
  dbAdmin.all(sql, [], (err, rows) => {
    console.log(rows)
    const sql_product = "SELECT * FROM productos"
    dbAdmin.all(sql_product, [], (err, rows_product) => {
      const sql_img = "SELECT * FROM imagenes";
      dbAdmin.all(sql_img, [], (err, rows_img) => {
        res.render("interfaz.ejs", {
          data: rows,
          data_product: rows_product,
          row_img: rows_img
        });
      })

    })
  })
})



router.get('/editcategory/', (req, res) => {
  /*
  const id = req.params.id;
  const sql = "SELECT * FROM categorias WHERE id = ?"
  dbAdmin.get(sql,id,(err,rows) => {
    res.render('editcategory',{data:rows})
  })*/
  const sql = "SELECT * FROM categorias";
  dbAdmin.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    } else {

      res.render("editcategory.ejs", { data: rows });
    }
  })
})

router.get('/addimg/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productos WHERE id = ?"
  dbAdmin.all(sql, id, (err, row) => {
    if (err) {
      console.log(err)
    } else {
      res.render('addimg', { data: row })
    }
  })
})


router.post('/addimg/:id', (req, res) => {
  const destacado = 1
  const id = req.params.id;
  const producto_id = id;
  const img_url = req.body.url_img;
  const query = [producto_id,img_url, destacado,id]
  const sql = "UPDATE imagenes SET producto_id = ?, url = ?, destacado = ? WHERE ( id = ?)"
  dbAdmin.run(sql, query, (err) => {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/interfaz')
    }
  })
})



router.post('/updatecategory/:id', (req, res) => {
  const id = req.params.id;
  const info = [req.body.updatecategory, id]
  const sql = "UPDATE categorias SET nombre = ? WHERE ( id = ?)";
  dbAdmin.run(sql, info, err => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/interfaz');
    }
  })
})


router.get('/editproduct/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productos WHERE id = ?"
  const sql_category = "SELECT * FROM categorias"
  dbAdmin.get(sql, id, (err, row) => {
    dbAdmin.all(sql_category, (err, row_category) => {
      res.render('editproduct', {
        data: row,
        data_category: row_category
      })
    })

  })
})

router.get("/deleteproduct/:id",(req, res)=>{
	const id=req.params.id;
	const sql="DELETE FROM productos WHERE id = ?";
  const sql_img = "DELETE FROM imagenes WHERE id = ?"
	dbAdmin.run(sql, id, err =>{	
			dbAdmin.run(sql_img,id, err => {
        if(err){
          console.log(err);
        }else{
          res.redirect('/interfaz')
        }
      })
	});
})
/*
router.get("/deletecategory",(req, res)=>{

  const sql = "SELECT * FROM categorias"
  dbAdmin.all(sql,[],(err,row) => {
    res.render('deletecategory',{
      data:row
    })
  })
	
})

router.post("/deletecategory/:id",(req, res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM categorias WHERE id = ?"
  dbAdmin.run(sql,id,err => {
    res.redirect('/interfaz')
  })
	
})

*/



router.post('/updateproduct/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const code = req.body.code;
  const price = req.body.price;
  const description = req.body.description;
  const screen = req.body.screen;
  const cpu = req.body.cpu;
  const img_url = req.body.url;
  const id_category = req.body.category_id;
  const query = [name, code, price, description, screen, cpu, id_category, id]
  const sql = "UPDATE productos SET nombre = ?,codigo = ?,precio = ?, descripcion = ?,pantalla = ?,procesador = ?, categoria_id = ? WHERE (id = ?)"
  dbAdmin.run(sql, query, err => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/interfaz')
    }
  })
})




router.get('/addproduct', (req, res) => {
  const sql = "SELECT * FROM categorias";
  dbAdmin.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    } else {
      res.render("addproduct", {
        data: rows
      });
    }
  })
})

router.post('/category', (req, res) => {
  const category = req.body.category;
  dbAdmin.run(`INSERT INTO categorias (nombre) VALUES (?);`, [category], (err) => {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/interfaz')
    }
  })
})

router.get('/addcategory', (req, res) => {
  res.render('addcategory')
})






router.post('/products', (req, res) => {
  const url_ghost = '';
  const id = '';
  const destacado = 1;
  const name = req.body.name;
  const code = req.body.code;
  const price = req.body.price;
  const description = req.body.description;
  const screen = req.body.screen;
  const cpu = req.body.cpu;
  const id_category = req.body.id_category;
  dbAdmin.run(`INSERT INTO productos (nombre, codigo, precio, descripcion, pantalla, procesador, categoria_id) VALUES (?,?,?,?,?,?,?);`,
    [name, code, price, description, screen, cpu, id_category], (err) => {
      dbAdmin.run(`INSERT INTO imagenes (producto_id,url,destacado) VALUES (?,?,?)`,[id,url_ghost,destacado], (err) =>{
        if(err){
          console.log(err)
        }else{
          res.redirect('/interfaz')
        }
      })
    });

})


router.post('/login', (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  if (user == process.env.ADMIN && password == process.env.ADMIN_PASS) {
    res.redirect('/interfaz')
  }
  else {
    res.redirect('/')
  }
})


module.exports = router;
