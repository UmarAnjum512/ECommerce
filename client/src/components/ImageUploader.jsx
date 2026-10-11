import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload, X, Loader2 } from 'lucide-react';

/**
 * File picker jo image ko Cloudinary par upload karta hai.
 * multiple=false -> value ek URL string, onChange(url)
 * multiple=true  -> value URLs ka array, onChange([urls])
 */
export default function ImageUploader({ value, onChange, multiple = false, required = false }) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const urls = multiple ? value || [] : value ? [value] : [];

  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await axios.post('/api/upload', fd, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    return data.url;
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = [];
      for (const f of files) uploaded.push(await uploadOne(f));
      if (multiple) onChange([...urls, ...uploaded]);
      else onChange(uploaded[0]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (i) => {
    if (multiple) onChange(urls.filter((_, idx) => idx !== i));
    else onChange('');
  };

  return (
    <div>
      <label className="flex items-center justify-center gap-2 border border-dashed border-neutral-400 p-3 cursor-pointer hover:border-black text-neutral-600 text-xs">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <span>{uploading ? 'Uploading...' : multiple ? 'Choose image(s)' : 'Choose image'}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple={multiple}
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* Hidden field taake required validation kaam kare */}
      {required && (
        <input
          tabIndex={-1}
          required
          value={urls.length ? 'ok' : ''}
          onChange={() => {}}
          className="opacity-0 h-0 w-0 absolute pointer-events-none"
        />
      )}

      {error && <p className="text-red-600 text-[11px] mt-1">{error}</p>}

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {urls.map((u, i) => (
            <div key={u + i} className="relative w-16 h-20 border border-neutral-200 bg-neutral-100">
              <img src={u} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
