import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { getProducts } from "../services/clientList"
import ProductCard from "../components/ProductCard"

export default function ListProductClientPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchParams] = useSearchParams()
  const gridRef = useRef(null)
  const [itemsPerRow, setItemsPerRow] = useState(4)
  const [pageSize, setPageSize] = useState(8)

  const searchQuery = searchParams.get("search") || ""

  // Detect items per row based on grid columns
  useEffect(() => {
    const detectItemsPerRow = () => {
      if (!gridRef.current) return

      const gridComputedStyle = window.getComputedStyle(gridRef.current)
      const gridTemplateColumns = gridComputedStyle.gridTemplateColumns
      const columnCount = gridTemplateColumns.split(" ").length

      setItemsPerRow(columnCount)
      setPageSize(columnCount * 2)
    }

    detectItemsPerRow()
    window.addEventListener("resize", detectItemsPerRow)

    return () => window.removeEventListener("resize", detectItemsPerRow)
  }, [])

  // Load products when search changes or pageSize changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setProducts([])
      setPageSize(itemsPerRow * 2)
      setHasMore(true)
    }
  }, [searchQuery, itemsPerRow])

  // Load products with pageNumber always = 1, pageSize = current size
  useEffect(() => {
    loadProducts()
  }, [pageSize])

  const loadProducts = async () => {
    if (loading || pageSize === 0) return

    setLoading(true)
    try {
      const { data, error } = await getProducts(searchQuery || null, null, 1, pageSize)

      if (error) {
        console.error("Error loading products:", error)
        setLoading(false)
        return
      }

      const loadedProducts = data.productItems || []
      setProducts(loadedProducts)

      setHasMore(loadedProducts.length === pageSize)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setPageSize((prevPageSize) => prevPageSize + itemsPerRow)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{searchQuery ? `Resultados para "${searchQuery}"` : "Productos"}</h1>

      {/* Products Grid */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && products.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Cargar más
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? `No se encontraron productos para "${searchQuery}"` : "No hay productos disponibles"}
        </div>
      )}
    </div>
  )
}
