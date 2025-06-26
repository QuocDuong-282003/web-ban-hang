import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// Import đúng các hàm cần thiết
import { getAllNews, deleteNews, updateNews, createNews } from '../../services/userNews';
import UpdateNewModal from '../ModalNew/updateNewModal';
import AddNewModal from '../ModalNew/addNewModal';
import './New.scss';

const News = () => {
    // Đổi tên state cho rõ ràng, dễ hiểu
    const [newsList, setNewsList] = useState([]);
    const [selectedNewsItem, setSelectedNewsItem] = useState(null); // Bài viết đang được chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của Modal
    const [isAddModal, setIsAddModal] = useState(false);
    // Hàm lấy dữ liệu từ DB
    const fetchNews = async () => {
        try {
            const response = await getAllNews();
            setNewsList(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy news:', error);
            toast.error("Không thể tải danh sách news.");
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);


    const handleOpenUpdateModal = (newsItem) => {
        setSelectedNewsItem(newsItem);
        setIsModalOpen(true);
    };


    const handleSaveUpdate = async (newsId, formData, imageFile) => {
        try {

            const dataToSubmit = new FormData();


            Object.keys(formData).forEach(key => {
                dataToSubmit.append(key, formData[key]);
            });


            if (imageFile) {
                dataToSubmit.append('image', imageFile);
            }

            //  API updateNews
            await updateNews(newsId, dataToSubmit);

            toast.success('Cập nhật thành công!');
            setIsModalOpen(false);
            fetchNews(); // Tải lại danh sách 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    // HÀM 3: Xóa bài viết
    const handleDeleteClick = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) {
            try {
                await deleteNews(id);
                toast.success("Xóa thành công");
                fetchNews();
            } catch (error) {
                toast.error("Xóa thất bại")
            }
        }
    };
    const handleCreateNew = async (formDat, imageFile) => {
        try {
            const dataToSubmit = new FormData();
            Object.keys(formDat).forEach(key => {
                dataToSubmit.append(key, formDat[key]);
            });
            if (imageFile) {
                dataToSubmit.append('image', imageFile);
            }
            await createNews(dataToSubmit);
            toast.success('Create new blog success !');
            setIsAddModal(false);
            fetchNews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Create blog fail')

        }
    }
    return (
        <div>
            <h2>Danh sách tin tức</h2>
            <div className='add-button-container'>
                <button className='btn-primary' onClick={() => setIsAddModal(true)}> <i class="fa fa-plus-square-o"></i>+</button>
            </div>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Title</th>
                        <th>Excerpt</th>
                        <th>Content</th>
                        <th>Image</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Lặp qua `newsList` */}
                    {newsList.map((newsItem, index) => (
                        <tr key={newsItem._id}>
                            <td>{index + 1}</td>
                            <td>{newsItem.title}</td>
                            <td>{newsItem.excerpt}</td>
                            <td>{newsItem.content}</td>
                            <td>
                                {newsItem.imageBase64 ? (
                                    <img src={newsItem.imageBase64} alt={newsItem.title} className="product-img" />
                                ) : ('Không có ảnh')}
                            </td>
                            <td>{newsItem.author}</td>
                            <td>{newsItem.status}</td>
                            <td>
                                <button className="btn-danger new-action-button" onClick={() => handleDeleteClick(newsItem._id)}>
                                    Xóa
                                </button>

                                <button className="btn-warning new-action-button" onClick={() => handleOpenUpdateModal(newsItem)}>
                                    Sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <UpdateNewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUpdate}
                newsItem={selectedNewsItem}
            />
            <AddNewModal
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                onSave={handleCreateNew}
            />
        </div>
    );
};

export default News;