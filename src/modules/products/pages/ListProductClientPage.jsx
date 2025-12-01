import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { getProducts } from "../services/clientList"
import ProductCard from "../components/ProductCard"

export default function ListProductClientPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const gridRef = useRef(null)
  const [itemsPerRow, setItemsPerRow] = useState(4)

  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [total, setTotal] = useState(0)

  const searchQuery = searchParams.get("search") || ""

  // Detect items per row based on grid columns
  useEffect(() => {
    const detectItemsPerRow = () => {
      if (!gridRef.current) return

      const gridComputedStyle = window.getComputedStyle(gridRef.current)
      const gridTemplateColumns = gridComputedStyle.gridTemplateColumns
      const columnCount = gridTemplateColumns.split(" ").length

      setItemsPerRow(columnCount)
    }

    detectItemsPerRow()
    window.addEventListener("resize", detectItemsPerRow)

    return () => window.removeEventListener("resize", detectItemsPerRow)
  }, [])

  useEffect(() => {
    setPageNumber(1)
    setProducts([])
  }, [searchQuery])

  useEffect(() => {
    loadProducts()
  }, [pageNumber, pageSize, searchQuery])

  // Scroll to top whenever the pageNumber, pageSize or searchQuery changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [pageNumber, pageSize, searchQuery])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await getProducts(searchQuery || "", null, pageNumber, pageSize)
      
      if (error) {
        setLoading(false)
        return
      }

      const loadedProducts = data.productItems || []
      setProducts(loadedProducts)
      setTotal(data.total || 0)
    } catch (error) {
      console.error("[v0] Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(Number(newPageSize))
    setPageNumber(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{searchQuery ? `Resultados para "${searchQuery}"` : "Productos"}</h1>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? `No se encontraron productos para "${searchQuery}"` : "No hay productos disponibles"}
        </div>
      )}

      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8">
          {/* Compact mobile pagination: icons + small info */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              aria-label="Página anterior"
              disabled={pageNumber === 1}
              onClick={handlePreviousPage}
              className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed rounded hover:bg-gray-300 transition-colors text-sm"
            >
              {/* Left chevron SVG */}
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline ml-2">Atrás</span>
            </button>

            {/* Small page info on mobile and full on desktop */}
            <span className="text-sm font-medium hidden sm:inline">
              Página {pageNumber} de {totalPages}
            </span>
            <span className="text-sm font-medium sm:hidden">
              {pageNumber}/{totalPages}
            </span>

            <button
              aria-label="Página siguiente"
              disabled={pageNumber === totalPages}
              onClick={handleNextPage}
              className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed rounded hover:bg-gray-300 transition-colors text-sm"
            >
              <span className="hidden sm:inline mr-2">Siguiente</span>
              {/* Right chevron SVG */}
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Page size select: hide on very small screens to save space */}
          <div className="flex items-center gap-2">
            <label className="hidden sm:block text-sm">Mostrar:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="px-2 py-1 sm:px-2 sm:py-2 border border-gray-300 rounded text-sm"
            >
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
