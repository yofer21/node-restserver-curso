const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// =======================================
//  Obtener productos
// =======================================
app.get('/productos', verificaToken, (req, res) => {
  // Trae todos los productos
  // populate: usuario categoria
  // paginado

  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar productos',
          err
        });
      }

      res.json({
        ok: true,
        productos
      });
    });

});

// =======================================
//  Obtener producto por ID
// =======================================
app.get('/productos/:id', verificaToken, (req, res) => {
  // populate: usuario categoria

  let id = req.params.id;

  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar producto',
          err
        });
      }


      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error buscar producto',
          err: { message: 'Error buscar producto' }
        });
      }

      res.json({
        ok: true,
        producto: productoDB
      });


    });

});


// =======================================
//  Buscar productos
// =======================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

  let termino = req.params.termino;

  let regexp = new RegExp(termino, 'i');

  Producto.find({ nombre: regexp })
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar productos',
          err
        });
      }

      res.json({
        ok: true,
        productos
      });

    })
})

// =======================================
//  Crear producto
// =======================================
app.post('/productos', verificaToken, (req, res) => {

  let body = req.body;

  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error crear producto',
        err
      });
    }

    res.json({
      ok: true,
      producto: productoDB
    })
  });

});

// =======================================
//  Actualizar producto
// =======================================
app.put('/productos/:id', verificaToken, (req, res) => {

  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error actualizar producto',
        err
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error crear producto',
        err: { message: 'Error crear producto' }
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error actualizar producto',
          err
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado
      });
    })


  })

});

// =======================================
//  Borrar producto
// =======================================
app.delete('/productos/:id', verificaToken, (req, res) => {

  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error eliminar producto',
        err
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error eliminar producto',
        err: { message: 'Error eliminar producto' }
      });
    }

    productoDB.disponible = false;

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error eliminar producto',
          err
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        mensaje: 'Producto borrado'
      });

    })


  })


});



module.exports = app;