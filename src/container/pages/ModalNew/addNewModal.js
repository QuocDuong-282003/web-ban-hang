// --- START OF FILE addNewModal.js (ĐÃ SỬA) ---

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { uploadContentImage } from '../../services/userNews';

// 1. Import các thư viện mới
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// Import CSS của editor
import 'react-markdown-editor-lite/lib/index.css';

// 2. Khởi tạo parser Markdown
const mdParser = new MarkdownIt(/* Markdown-it options */);

const AddNewModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '', // Đây là nơi lưu trữ cú pháp Markdown
        author: '',
        status: 'published',
    });
    const [imageFile, setImageFile] = useState(null);

    if (!isOpen) return null;

    const handleOnchange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };

    // 3. Hàm xử lý thay đổi nội dung từ editor
    function handleEditorChange({ html, text }) {
        // Chúng ta chỉ cần lưu lại văn bản Markdown thô
        setFormData(prev => ({ ...prev, content: text }));
    }

    const handleImageFile = async (event) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
        }
    };

    // 4. Hàm để xử lý việc upload ảnh trong nội dung bài viết
    async function onImageUpload(file) {
        try {
            // 1. Gọi API để upload file
            const response = await uploadContentImage(file);

            // 2. Kiểm tra xem server có trả về đúng định dạng không
            if (response && response.data && response.data.url) {
                // 3. Log ra để kiểm tra URL có đúng không
                console.log('Server returned URL:', response.data.url);

                // 4. Trả về CHỈ chuỗi URL cho MdEditor
                return response.data.url;
            } else {
                // Nếu server trả về lỗi hoặc định dạng sai
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
        onSave(formData, imageFile);
    };

    return (
        <div className='modal-over-new'>
            <div className='modal-new-container'>
                <h2>Add new blogs</h2>
            </div>
            <form onSubmit={(event) => event.preventDefault()}>
                <div className='form-group'>
                    <label >Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleOnchange} />
                </div>
                <div className='form-group'>
                    <label >Excerpt</label>
                    <input type="text" name="excerpt" value={formData.excerpt} onChange={handleOnchange} />
                </div>
                <div className='form-group'>
                    <label >Content</label>

                    <MdEditor
                        style={{ height: '400px', width: '100%' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={handleEditorChange}
                        onImageUpload={onImageUpload}
                    />
                </div>
                <div className='form-group'>
                    <label >Image (Ảnh đại diện)</label>
                    <input type="file" accept="image/*" onChange={handleImageFile} />
                </div>
                <div className='form-group'>
                    <label >Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleOnchange} />
                </div>
                <div className='form-group'>
                    <label >Status</label>
                    <select name="status" value={formData.status} onChange={handleOnchange}>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </form>
            <div className='modal-actions-new'>
                <button type="button" onClick={onClose} className='btn-secondary'>Cancel</button>
                <button onClick={handleSave} className='btn-primary'>Add new</button>
            </div>
        </div>
    )
}
export default AddNewModal;