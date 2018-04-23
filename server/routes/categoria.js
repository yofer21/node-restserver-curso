const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =======================================
//  Mostrar todas las categorias
// =======================================


app.get('/categoria', verificaToken, (req, res) => {

  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error buscar categoria',
          err
        });

      }
      res.json({
        ok: true,
        categorias
      });

    });

});

// =======================================
//  Mostrar una categoria por ID
// =======================================


app.get('/categoria/:id', verificaToken, (req, res) => {


  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error buscar categoria',
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error buscar categoria',
        err: { message: 'Error al buscar categoria' }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  })


});

// =======================================
//  Crear nueva categoria
// =======================================
app.post('/categoria', verificaToken, (req, res) => {
  // Regresa la nueva categoria

  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error crear categoria',
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error crear categoria',
        err: { message: 'Error al crear categoria' }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });

  });
});

// =======================================
//  Actualizar una categoria
// =======================================
app.put('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion
  }

  Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error actualizar categoria',
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error actualizar categoria',
        err: { message: 'Error al actualizar categoria' }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  })

});


// =======================================
//  Eliminar una categoria
// =======================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  // Solo un administrador puede borrar categorias

  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error eliminar categoria',
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error eliminar categoria',
        err: { message: 'Error al eliminar categoria' }
      });
    }

    res.json({
      ok: true,
      message: 'Categoria borrada'
    });

  })
});

module.exports = app;