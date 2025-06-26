// --- THAY THẾ TOÀN BỘ FILE: src/components/Product/ProductTable.js ---

import React, { useState, useEffect } from 'react';
import AddProductModal from '../Modal/AddProductModal';
import EditProductModal from '../Modal/EditProductModal';
import AssignDiscountModal from '../Modal/AssignDiscountModal';

import { toast } from 'react-toastify';
import './ProductTable.css';
import { handleAddProduct, getAllProduct, handleUpdateProduct, handleDeleteProduct, assignDiscountsToProduct } from '../../services/userService';

const ProductTable = () => {
  // State quản lý danh sách sản phẩm
  const [products, setProducts] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  // Modal thêm/sửa sản phẩm
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State tìm kiếm và phân trang
  const [searchItem, setSearchItem] = useState('');
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const openAssignModal = (product) => {
    setSelectedProduct(product);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedProduct(null);
  };

  const handleAssignDiscounts = async (discountId) => {
    if (!selectedProduct) return;
    try {
      await assignDiscountsToProduct(selectedProduct._id, discountId);
      toast.success("Cập nhật mã giảm giá thành công!");
      closeAssignModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProduct();
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  };

  const handleAdd = async (formData) => {
    try {

      await handleAddProduct(formData);

      toast.success("Thêm sản phẩm thành công!");
      setShowAddModal(false); // Đóng modal
      fetchProducts(); // Làm mới danh sách
    } catch (err) {
      // Bắt lỗi và hiển thị toast
      const errorMessage = err.response?.data?.message || "Lỗi khi thêm sản phẩm";
      toast.error(errorMessage);
      throw err; // Ném lỗi lại để component con có thể biết là đã thất bại
    }
  };

  useEffect(() => {
    const lowercasedFilter = searchItem.toLowerCase();
    const filtered = products.filter(product => {
      return (
        product.name.toLowerCase().includes(lowercasedFilter) ||
        (product.category && product.category.name.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredProduct(filtered);
    setCurrentPage(1);
  }, [searchItem, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProduct.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProduct.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEdit = async (formData) => {
    if (!selectedProduct || !selectedProduct._id) {
      toast.error("Không tìm thấy sản phẩm để cập nhật!");
      return;
    }
    try {
      const productID = selectedProduct._id;
      await handleUpdateProduct(productID, formData);
      toast.success("Cập nhật sản phẩm thành công!");
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Cập nhật sản phẩm thất bại!";
      toast.error(errorMessage);
      throw err; // Ném lỗi lại để modal biết và không tự đóng
    }
  };

  const handleDelete = async (id) => {
    // Thêm confirm dialog để an toàn hơn
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await handleDeleteProduct(id);
        toast.success("Đã xóa sản phẩm thành công!");
        fetchProducts();
      } catch (err) {
        toast.error("Xóa sản phẩm thất bại!");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '0 ₫';
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="product-container">
      <h2>Danh sách sản phẩm</h2>
      <button onClick={() => setShowAddModal(true)} className='product-button'>+ Thêm sản phẩm</button>

      <div className="top-bar">
        <h3 className="page-title">Tổng số bản ghi: {filteredProduct.length}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Nhập để tìm kiếm..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            {/* SỬA Ở ĐÂY: Thêm cột "Tùy chọn" */}
            <th>Tùy chọn</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Danh mục</th>
            <th>Áp dụng mã</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((product, index) => {
            const isSale = product.discountInfo && product.price > product.finalPrice;

            return (
              <tr key={product._id}>
                <td>{indexOfFirstProduct + index + 1}</td>
                <td>{product.name}</td>

                {/* SỬA Ở ĐÂY: Thêm ô dữ liệu cho cột "Tùy chọn" */}
                <td>
                  {product.options && product.options.length > 0 ? (
                    <ul className="options-list">
                      {product.options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  ) : (
                    'Không có'
                  )}
                </td>

                <td>
                  {isSale ? (
                    <div>
                      <span style={{ color: 'red', fontWeight: 'bold' }}>
                        {formatPrice(product.finalPrice)}
                      </span>
                      <div style={{ textDecoration: 'line-through', fontSize: '12px', color: '#888' }}>
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  ) : (
                    <span>{formatPrice(product.price)}</span>
                  )}
                </td>

                <td>{product.stock}</td>
                <td>{product.category ? product.category.name : 'Không có'}</td>

                <td>
                  {isSale ? `${product.discountInfo.code} (${product.discountInfo.description})` : 'Không'}
                </td>

                <td>
                  {product.imageBase64 ? (
                    <img src={product.imageBase64} alt={product.name} className="product-img" />
                  ) : (
                    'Không có ảnh'
                  )}
                </td>

                <td>
                  <button className="product-action-button product-edit-button"
                    onClick={() => { setSelectedProduct(product); setShowEditModal(true); }}>Sửa</button>
                  <button className="product-action-button" onClick={() => openAssignModal(product)}>Gán mã GG</button>
                  <button className="product-action-button product-delete-button"
                    onClick={() => handleDelete(product._id)}>Xoá</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedProduct(null); }}
          product={selectedProduct}
          onSave={handleEdit}
          existingProducts={products}
        />
      )}

      {selectedProduct && (
        <AssignDiscountModal
          isOpen={showAssignModal}
          onClose={closeAssignModal}
          onSave={handleAssignDiscounts}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductTable;