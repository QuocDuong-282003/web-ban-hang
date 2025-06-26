// --- START OF FILE updateNewModal.js (ĐÃ SỬA) ---

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// 1. Import các thư viện mới
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// Import CSS của editor
import 'react-markdown-editor-lite/lib/index.css';

import './updateNewModal.css';

// 2. Khởi tạo parser Markdown
const mdParser = new MarkdownIt();

const UpdateNewModal = ({ isOpen, onClose, onSave, newsItem }) => {
    const [formData, setformData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        status: 'published',
    })
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        if (newsItem) {
            setformData({
                title: newsItem.title || '',
                excerpt: newsItem.excerpt || '',
                content: newsItem.content || '', // Quan trọng: Gán giá trị content vào state
                author: newsItem.author || '',
                status: newsItem.status || 'published',
            });
            setNewImage(null);
        }
    }, [newsItem]);

    if (!isOpen) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setformData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Hàm xử lý thay đổi nội dung từ editor
    const handleEditorChange = ({ text }) => {
        setformData(prev => ({ ...prev, content: text }));
    };

    // 4. Hàm để xử lý việc upload ảnh trong nội dung bài viết (y hệt như trong AddNewModal)
    async function onImageUpload(file) {
        const body = new FormData();
        body.append('image', file);
        try {
            const response = await axios.post('http://localhost:5000/api/upload/image', body);
            return response.data.url;
        } catch (error) {
            toast.error("Tải ảnh trong bài viết thất bại!");
            console.error("Upload failed", error);
            return Promise.reject(error);
        }
    }

    const handleSave = async () => {
        onSave(newsItem._id, formData, newImage);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImage(event.target.files[0])
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Cập nhật tin tức</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Tiêu đề</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Đoạn trích</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Nội dung</label>
                        {/* 5. Thay thế SimpleMDE bằng MdEditor, truyền 'value' cho nó */}
                        <MdEditor
                            style={{ height: '400px' }}
                            value={formData.content}
                            renderHTML={text => mdParser.render(text)}
                            onChange={handleEditorChange}
                            onImageUpload={onImageUpload}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tác giả</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Ảnh đại diện mới (Để trống nếu không muốn thay đổi)</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                </form>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-secondary">Hủy</button>
                    <button onClick={handleSave} className="btn-primary">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateNewModal;