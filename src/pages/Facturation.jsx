import { React, useEffect, useState } from 'react'
import TableFactura from '../components/facturacion/TableFactura';

export default function Facturation() {

  const [factura, setfactura] = useState([])

  useEffect(() => {
    fetch('http://localhost:5063/api/Factura/ListarFacturas')
      .then((res) => res.json())
      .then((data) => {
        let facturas = data.facturas
        setfactura(facturas)
      })
  }, [])

  console.table(factura)

  return (
    <TableFactura />
  );
}
