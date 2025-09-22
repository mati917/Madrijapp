let boguerCache = {}

/**
 * Cargar el cache con la data de bogrim.
 * @param {Array} dataBogrim - Array de objetos bogrim [{ dni, name, ... }]
 */
export function cargarBogrim(dataBogrim) {
  boguerCache = {}
  if (!Array.isArray(dataBogrim)) return
  dataBogrim.forEach((b) => {
    if (b.dni) {
      boguerCache[String(b.dni)] = b.name + ' ' + b.lastname
    }
  })
}

/**
 * Devuelve el nombre de un boguer a partir de su dni.
 * @param {string|number} dni - Identificador del boguer.
 * @returns {string} Nombre del boguer o el dni si no se encuentra.
 */
export function boguerMap(dni) {
  return boguerCache[String(dni)] || dni
}
