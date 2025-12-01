import { set } from 'react-hook-form';
import Card from '../../shared/components/Card';
import { useState, useEffect } from 'react';
import { getProducts } from '../../products/services/list';
import { listOrders } from '../../orders/services/listServices';

function Home() {

  const [totalProductos, setTotalProductos] = useState([])
  const [totalOrdenes, setTotalOrdenes] = useState([])

    useEffect(() => {
      loadTotals()
    }, [])
  
  const loadTotals  = async () => {
    const { data: products, error } =  await getProducts(null, 1, 1);
    const { data: orders, error: orderError } =  await listOrders(null, null, 1, 1);
    
    if (error) {
      console.error("Error loading products:", error)
      setLoading(false)
      return
    }
    
    setTotalProductos(products.total)
    setTotalOrdenes(orders.total)
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
        <p>Cantidad: {totalOrdenes}</p>
      </Card>
    </div>
  );
};

export default Home;
