import { set } from 'react-hook-form';
import Card from '../../shared/components/Card';
import { useState, useEffect } from 'react';
import { getProducts } from '../../products/services/list';

function Home() {

  const [totalProductos, setTotalProductos] = useState([])
  const [totalOrdenes, setTotalOrdenes] = useState([])

    useEffect(() => {
      loadTotals()
    }, [])
  
  const loadTotals  = async () => {
    const { data, error } = await getProducts()

    if (error) {
      console.error("Error loading products:", error)
      setLoading(false)
      return
    }
    
    setTotalProductos(data.total)
    // setTotalOrdenes(orders.totalOrders)
  }

  return (
    <div
      className='flex flex-col gap-3 sm:grid sm:grid-cols-2'
    >
      <Card>
        <h3>Productos</h3>
        <p>Cantidad: {totalProductos}</p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: #</p>
      </Card>
    </div>
  );
};

export default Home;
