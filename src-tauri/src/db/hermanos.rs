use rusqlite::{params, Result, Row};
use crate::db::{Hermano, DbConnection};

impl Hermano {
    pub fn from_row(row: &Row) -> Result<Self, rusqlite::Error> {
        Ok(Hermano {
            id: Some(row.get(0)?),
            numero_hermano: row.get(1)?,
            nombre: row.get(2)?,
            apellidos: row.get(3)?,
            dni: row.get(4)?,
            fecha_nacimiento: row.get(5)?,
            fecha_alta: row.get(6)?,
            familia_id: row.get(7)?,
            telefono: row.get(8)?,
            email: row.get(9)?,
            direccion: row.get(10)?,
            activo: row.get(11)?,
            observaciones: row.get(12)?,
            created_at: row.get(13)?,
            updated_at: row.get(14)?,
        })
    }
}

pub fn get_all_hermanos(db: &DbConnection) -> Result<Vec<Hermano>, anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;
    let mut stmt = conn.prepare(
        "SELECT id, numero_hermano, nombre, apellidos, dni, fecha_nacimiento,
                fecha_alta, familia_id, telefono, email, direccion, activo,
                observaciones, created_at, updated_at
         FROM hermanos
         ORDER BY numero_hermano"
    )?;

    let hermanos = stmt.query_map([], |row| {
        Hermano::from_row(row)
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(hermanos)
}

pub fn get_hermanos_activos(db: &DbConnection) -> Result<Vec<Hermano>, anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;
    let mut stmt = conn.prepare(
        "SELECT id, numero_hermano, nombre, apellidos, dni, fecha_nacimiento,
                fecha_alta, familia_id, telefono, email, direccion, activo,
                observaciones, created_at, updated_at
         FROM hermanos
         WHERE activo = 1
         ORDER BY numero_hermano"
    )?;

    let hermanos = stmt.query_map([], |row| {
        Hermano::from_row(row)
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(hermanos)
}

pub fn get_hermano_by_id(db: &DbConnection, id: i32) -> Result<Option<Hermano>, anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;
    let mut stmt = conn.prepare(
        "SELECT id, numero_hermano, nombre, apellidos, dni, fecha_nacimiento,
                fecha_alta, familia_id, telefono, email, direccion, activo,
                observaciones, created_at, updated_at
         FROM hermanos
         WHERE id = ?1"
    )?;

    match stmt.query_row([id], |row| Hermano::from_row(row)) {
        Ok(hermano) => Ok(Some(hermano)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.into()),
    }
}

pub fn search_hermanos(db: &DbConnection, query: &str) -> Result<Vec<Hermano>, anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;
    let search_pattern = format!("%{}%", query);

    let mut stmt = conn.prepare(
        "SELECT id, numero_hermano, nombre, apellidos, dni, fecha_nacimiento,
                fecha_alta, familia_id, telefono, email, direccion, activo,
                observaciones, created_at, updated_at
         FROM hermanos
         WHERE (nombre LIKE ?1 OR apellidos LIKE ?1 OR numero_hermano LIKE ?1 OR dni LIKE ?1)
         ORDER BY numero_hermano"
    )?;

    let hermanos = stmt.query_map([&search_pattern], |row| {
        Hermano::from_row(row)
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(hermanos)
}

pub fn create_hermano(db: &DbConnection, hermano: &Hermano) -> Result<i32, anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;

    // Generar número de hermano único si está vacío
    let numero_hermano = if hermano.numero_hermano.trim().is_empty() {
        let count: i32 = conn.query_row("SELECT COUNT(*) FROM hermanos", [], |row| {
            Ok(row.get(0)?)
        })?;
        format!("H{:04}", count + 1)
    } else {
        hermano.numero_hermano.clone()
    };

    let dni = hermano.dni.as_ref().filter(|s| !s.trim().is_empty());
    let telefono = hermano.telefono.as_ref().filter(|s| !s.trim().is_empty());
    let email = hermano.email.as_ref().filter(|s| !s.trim().is_empty());
    let direccion = hermano.direccion.as_ref().filter(|s| !s.trim().is_empty());
    let fecha_nacimiento = hermano.fecha_nacimiento.as_ref().filter(|s| !s.trim().is_empty());
    let observaciones = hermano.observaciones.as_ref().filter(|s| !s.trim().is_empty());

    let _id = conn.execute(
        "INSERT INTO hermanos
         (numero_hermano, nombre, apellidos, dni, fecha_nacimiento, fecha_alta,
          familia_id, telefono, email, direccion, activo, observaciones)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            numero_hermano,
            hermano.nombre,
            hermano.apellidos,
            dni,
            fecha_nacimiento,
            hermano.fecha_alta,
            hermano.familia_id,
            telefono,
            email,
            direccion,
            hermano.activo,
            observaciones,
        ],
    )?;

    Ok(conn.last_insert_rowid() as i32)
}

pub fn update_hermano(db: &DbConnection, id: i32, hermano: &Hermano) -> Result<(), anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;

    let dni = hermano.dni.as_ref().filter(|s| !s.trim().is_empty());
    let telefono = hermano.telefono.as_ref().filter(|s| !s.trim().is_empty());
    let email = hermano.email.as_ref().filter(|s| !s.trim().is_empty());
    let direccion = hermano.direccion.as_ref().filter(|s| !s.trim().is_empty());
    let fecha_nacimiento = hermano.fecha_nacimiento.as_ref().filter(|s| !s.trim().is_empty());
    let observaciones = hermano.observaciones.as_ref().filter(|s| !s.trim().is_empty());

    conn.execute(
        "UPDATE hermanos
         SET numero_hermano = ?1, nombre = ?2, apellidos = ?3, dni = ?4,
             fecha_nacimiento = ?5, fecha_alta = ?6, familia_id = ?7,
             telefono = ?8, email = ?9, direccion = ?10, activo = ?11,
             observaciones = ?12, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?13",
        params![
            hermano.numero_hermano,
            hermano.nombre,
            hermano.apellidos,
            dni,
            fecha_nacimiento,
            hermano.fecha_alta,
            hermano.familia_id,
            telefono,
            email,
            direccion,
            hermano.activo,
            observaciones,
            id,
        ],
    )?;

    Ok(())
}

pub fn delete_hermano(db: &DbConnection, id: i32) -> Result<(), anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;

    conn.execute("DELETE FROM hermanos WHERE id = ?1", [id])?;

    Ok(())
}

pub fn set_hermano_inactive(db: &DbConnection, id: i32) -> Result<(), anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;

    conn.execute(
        "UPDATE hermanos SET activo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?1",
        [id]
    )?;

    Ok(())
}

pub fn get_hermanos_by_familia(db: &DbConnection, familia_id: i32) -> Result<Vec<Hermano>, anyhow::Error> {
    let conn = db.lock().map_err(|_| anyhow::anyhow!("Error de base de datos"))?;
    let mut stmt = conn.prepare(
        "SELECT id, numero_hermano, nombre, apellidos, dni, fecha_nacimiento,
                fecha_alta, familia_id, telefono, email, direccion, activo,
                observaciones, created_at, updated_at
         FROM hermanos
         WHERE familia_id = ?1
         ORDER BY nombre, apellidos"
    )?;

    let hermanos = stmt.query_map([familia_id], |row| {
        Hermano::from_row(row)
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(hermanos)
}
