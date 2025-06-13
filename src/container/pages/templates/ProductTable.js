import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      fetchProducts(); // Tải lại dữ liệu để cập nhật cột "Áp dụng mã"
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  // Hàm lấy danh sách sản phẩm từ server
  const fetchProducts = async () => {
    try {
      const res = await getAllProduct();
      console.log("Dữ liệu sản phẩm nhận được: ", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  };

  // Hàm xử lý thêm sản phẩm mới
  const handleAdd = async (formData) => {
    try {
      const res = await handleAddProduct(formData);
      fetchProducts(); // Làm mới danh sách
      return res;
    } catch (err) {
      console.error('Lỗi khi thêm sản phẩm:', err);
      toast.error("Lỗi khi thêm sản phẩm");
      throw err;
    }
  };

  // Lọc sản phẩm khi có tìm kiếm hoặc khi danh sách thay đổi
  useEffect(() => {
    const lowercasedFilter = searchItem.toLowerCase();
    const filtered = products.filter(product => {
      return (
        product.name.toLowerCase().includes(lowercasedFilter) ||
        (product.category && product.category.name.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredProduct(filtered);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, [searchItem, products]);

  // Phân trang: xác định sản phẩm hiển thị theo trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProduct.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProduct.length / productsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  // const handleEdit = async (formData) => {
  //   try {
  //     const productID = formData.append('_id', product._id);
  //     // Gọi hàm từ service
  //     await handleUpdateProduct(productID, formData);

  //     toast.success("Cập nhật sản phẩm thành công!");
  //     setShowEditModal(false);
  //     fetchProducts(); // Tải lại dữ liệu để thấy thay đổi
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || "Cập nhật sản phẩm thất bại!";
  //     toast.error(errorMessage);
  //     throw err; // Ném lỗi để modal không tự đóng
  //   }
  // };


  const handleEdit = async (formData) => {
    // `selectedProduct` là sản phẩm đang được chọn để sửa, nó chứa ID.
    if (!selectedProduct || !selectedProduct._id) {
      toast.error("Không tìm thấy sản phẩm để cập nhật!");
      return;
    }

    try {

      const productID = selectedProduct._id;


      await handleUpdateProduct(productID, formData);

      toast.success("Cập nhật sản phẩm thành công!");
      setShowEditModal(false);
      setSelectedProduct(null); // Reset sản phẩm đã chọn
      fetchProducts(); // Tải lại dữ liệu để thấy thay đổi

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Cập nhật sản phẩm thất bại!";
      toast.error(errorMessage);

    }
  };

  // 
  const handleDelete = async (id) => {

    try {
      // Gọi hàm từ service
      await handleDeleteProduct(id);
      toast.success("Đã xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      toast.error("Xóa sản phẩm thất bại!");
    }

  };

  // Tải danh sách khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);
  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    if (typeof price !== 'number') {
      return '0 ₫';
    }
    // Sử dụng toLocaleString cho định dạng dấu chấm ngăn cách hàng nghìn
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
            <th>Mô tả</th>
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
                <td>{product.description}</td>

                {/* Cột Giá*/}
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

                {/* Cột Áp dụng mã - Bây giờ sẽ hoạt động đúng */}
                <td>
                  {isSale ? `${product.discountInfo.code} (${product.discountInfo.description})` : 'Không'}
                </td>

                <td>
                  {product.imageBase64 ? (
                    <img
                      src={product.imageBase64}
                      alt={product.name}
                      className="product-img"
                    />
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

      {/* Phân trang */}
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

      {/* Modal Thêm */}
      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAdd} />

      {/* Modal Sửa */}
      {selectedProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedProduct(null); }}
          product={selectedProduct}
          onSave={handleEdit}
          existingProducts={products}
        />
      )}
      {/* RENDER MODAL MỚI */}
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
