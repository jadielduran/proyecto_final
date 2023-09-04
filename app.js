const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const apiVersion = '1.0.0';
const nameSystem = 'api-users';
const developer = 'Jadiel Josue Duran Gomez';
const email = 'djayoso@gmail.com';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'proyectofinal',
  password: 'admin123',
  port: 5432,
});

// Ruta para crear un usuario mediante POST
app.post('/usuarios', async (req, res) => {
  const { nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, celular, estado } = req.body;
  if (!nombres || !apellido_paterno || !apellido_materno || !fecha_nacimiento || !direccion || !celular || !estado) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    // Insertar el usuario en la base de datos
    const query = 'INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, celular, estado) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(query, [nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion,celular, estado]);

    return res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Ruta para obtener el promedio de edades de los usuarios
app.get('/usuarios/promedio-edad', async (req, res) => {
    try {
      // Realizar una consulta SQL para calcular el promedio de edades
      const query = "SELECT AVG(EXTRACT(YEAR FROM AGE(fecha_nacimiento))) AS promedioEdad FROM usuarios where estado='A'";
      const { rows } = await pool.query(query);
  
      // El resultado de la consulta contiene el promedio de edades
      //console.log(rows);
      const promedioEdad = rows[0];
      console.log(promedioEdad);
  
      return res.status(200).json({ promedioEdad });
    } catch (error) {
      console.error('Error al calcular el promedio de edades:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

// Ruta para listar todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
      // Realizar una consulta SQL para obtener todos los usuarios
      const query = "SELECT * FROM usuarios where estado='A'";
      const { rows } = await pool.query(query);
  
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

 // Ruta para listar un usuario en específico por su ID
app.get('/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
  
    try {
      // Realizar una consulta SQL para obtener al usuario por su ID
      const query = 'SELECT * FROM usuarios WHERE id = $1';
      const { rows } = await pool.query(query, [id_usuario]);
  
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });
 
// Ruta para actualizar los datos de un usuario por su ID
app.put('/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, celular } = req.body;
  
    try {
      // Verificar si el usuario existe
      const verificarUsuarioQuery = "SELECT * FROM usuarios WHERE id = $1 and estado='A'";
      const { rows } = await pool.query(verificarUsuarioQuery, [id_usuario]);
  
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      // Actualizar los datos del usuario
      const actualizarUsuarioQuery = `
        UPDATE usuarios 
        SET nombres = $1, apellido_paterno = $2, apellido_materno = $3, fecha_nacimiento = $4, direccion = $5, celular = $6, estado='A'
        WHERE id = $7
      `;
  
      await pool.query(actualizarUsuarioQuery, [nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion, celular, id_usuario]);
  
      return res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });
  
// Ruta para eliminar un usuario por su ID
app.delete('/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
  
    try {
      // Verificar si el usuario existe
      const verificarUsuarioQuery = "SELECT * FROM usuarios WHERE id = $1 and estado='A'";
      const { rows } = await pool.query(verificarUsuarioQuery, [id_usuario]);
  
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      // Eliminar el usuario en mi caso no se elimina el dato de la base para mantener coherencia en los datos 
      //por eso se creo la columna estado en la cual se actualiza se la actualiza a N que es inactivo 
      const eliminarUsuarioQuery = `
      UPDATE usuarios 
      SET estado='N'
      WHERE id = $1
    `;
      await pool.query(eliminarUsuarioQuery, [id_usuario]);
  
      return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

// Ruta para obtener la versión del API
app.get('/estado', (req, res) => {
    const estado = {
        nameSystem: nameSystem,
        version: apiVersion,
        developer: developer,
        email: email,
        mensaje: 'API REST elaborada en NodeJS',
    };
    res.status(200).json(estado);
  });

app.listen(port, () => {
  console.log(`Servidor API REST escuchando en el puerto ${port}`);
});
