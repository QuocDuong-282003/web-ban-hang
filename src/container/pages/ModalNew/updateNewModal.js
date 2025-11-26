// --- START OF FILE updateNewModal.js (ĐÃ SỬA) ---

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { uploadContentImage } from '../../services/userNews';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import './updateNewModal.css';

//  Khởi tạo parser Markdown
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
                content: newsItem.content || '',
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

    const handleEditorChange = ({ html, text }) => {
        setformData(prev => ({ ...prev, content: text }));
    };

    async function onImageUpload(file) {
        try {
            const response = await uploadContentImage(file);

            if (response && response.data && response.data.url) {
                return response.data.url;
            } else {
                toast.error("Server không trả về URL hợp lệ.");
                return Promise.reject("Invalid URL from server");
            }

        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error.response?.data || error.message);
            toast.error("Tải ảnh thất bại!");
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