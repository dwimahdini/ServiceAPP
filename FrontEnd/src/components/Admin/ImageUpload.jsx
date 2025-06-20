import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const ImageUpload = ({ onImageUploaded, currentImage, label = "Upload Gambar" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan!');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await authAPI.post('/upload/image', formData);

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        console.log('Image uploaded successfully:', imageUrl);
        setPreview(imageUrl);

        // Callback to parent component
        if (onImageUploaded) {
          console.log('Calling onImageUploaded callback with:', imageUrl);
          onImageUploaded(imageUrl);
        }

        alert('Gambar berhasil diupload!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.msg || 'Gagal mengupload gambar');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    if (onImageUploaded) {
      onImageUploaded(null);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg"
            />
            <div className="flex justify-center space-x-2">
              <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                Ganti Gambar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <button
                type="button"
                onClick={removeImage}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                disabled={uploading}
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {uploading ? 'Mengupload...' : 'Pilih Gambar'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG hingga 5MB
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Mengupload gambar...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
