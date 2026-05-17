'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  category: string;
}

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  brand: string;
}

type TabType = 'vehicles' | 'gallery' | 'add-vehicle' | 'add-gallery';

interface EditingVehicle extends Vehicle {
  model?: string;
  year?: number;
  description?: string;
  cloudinaryId?: string;
  specifications?: {
    engine: string;
    horsepower: number;
    topSpeed: number;
    acceleration: string;
    transmission: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<EditingVehicle | null>(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    try {
      const [vehiclesRes, galleryRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/gallery'),
      ]);
      setVehicles(await vehiclesRes.json());
      setGallery(await galleryRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setUploadedImage(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      setVehicles(vehicles.filter((v) => v._id !== id));
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      setGallery(gallery.filter((g) => g._id !== id));
      toast.success('Gallery item deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete gallery item');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle as EditingVehicle);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVehicle(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/50 border-b border-border sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/80 transition-all"
          >
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {([
            { id: 'vehicles', label: 'Manage Vehicles' },
            { id: 'gallery', label: 'Manage Gallery' },
            { id: 'add-vehicle', label: 'Add Vehicle' },
            { id: 'add-gallery', label: 'Add Gallery Item' },
          ] as { id: TabType; label: string }[]).map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Manage Vehicles */}
            {activeTab === 'vehicles' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Vehicles ({vehicles.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle._id}
                      whileHover={{ y: -5 }}
                      className="bg-secondary/50 border border-border rounded-lg overflow-hidden"
                    >
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-foreground">{vehicle.brand} {vehicle.name}</h3>
                        <p className="text-primary font-bold">PKR {vehicle.price.toLocaleString()}</p>
                        <p className="text-muted-foreground text-sm capitalize">{vehicle.category}</p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEditVehicle(vehicle)}
                            className="cursor-pointer flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-accent transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle._id)}
                            className="cursor-pointer flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/80 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Manage Gallery */}
            {activeTab === 'gallery' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Gallery ({gallery.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gallery.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ y: -5 }}
                      className="bg-secondary/50 border border-border rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-foreground line-clamp-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.brand}</p>
                        <button
                          onClick={() => handleDeleteGallery(item._id)}
                          className="cursor-pointer w-full mt-3 px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/80 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Add Vehicle Form */}
            {activeTab === 'add-vehicle' && (
              <VehicleFormComponent
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                uploading={uploading}
                onSuccess={() => {
                  setActiveTab('vehicles');
                  fetchData();
                }}
              />
            )}

            {/* Add Gallery Form */}
            {activeTab === 'add-gallery' && (
              <GalleryFormComponent
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                uploading={uploading}
                onSuccess={() => {
                  setActiveTab('gallery');
                  fetchData();
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Edit Vehicle Modal */}
      {isEditModalOpen && editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={handleCloseEditModal}
          onSuccess={() => {
            handleCloseEditModal();
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Vehicle Form Component
function VehicleFormComponent({
  uploadedImage,
  onImageUpload,
  uploading,
  onSuccess,
}: {
  uploadedImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: 'sports',
    year: new Date().getFullYear(),
    price: 0,
    description: '',
    engine: '',
    horsepower: 0,
    topSpeed: 0,
    acceleration: '',
    transmission: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['year', 'price', 'horsepower', 'topSpeed'].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) {
      toast.error('Please upload an image');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: uploadedImage,
          specifications: {
            engine: formData.engine,
            horsepower: formData.horsepower,
            topSpeed: formData.topSpeed,
            acceleration: formData.acceleration,
            transmission: formData.transmission,
          },
        }),
      });

      if (response.ok) {
        toast.success('Vehicle added successfully!');
        onSuccess();
      } else {
        toast.error('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 bg-secondary/50 p-8 rounded-lg border border-border"
    >
      <h2 className="text-2xl font-bold text-foreground">Add New Vehicle</h2>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Vehicle Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && <p className="text-muted-foreground">Uploading...</p>}
        </div>
        {uploadedImage && (
          <img src={uploadedImage} alt="Preview" className="mt-4 h-40 object-cover rounded-lg" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g., Porsche"
            required
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., 911"
            required
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          >
            <option value="sports">Sports</option>
            <option value="luxury">Luxury</option>
            <option value="suv">SUV</option>
            <option value="convertible">Convertible</option>
            <option value="exotic">Exotic</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price (PKR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the vehicle"
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Engine</label>
          <input
            type="text"
            name="engine"
            value={formData.engine}
            onChange={handleChange}
            placeholder="e.g., 3.0L Twin-Turbo"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Horsepower</label>
          <input
            type="number"
            name="horsepower"
            value={formData.horsepower}
            onChange={handleChange}
            placeholder="Horsepower"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Top Speed (mph)</label>
          <input
            type="number"
            name="topSpeed"
            value={formData.topSpeed}
            onChange={handleChange}
            placeholder="Top Speed"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Acceleration (0-100)</label>
          <input
            type="text"
            name="acceleration"
            value={formData.acceleration}
            onChange={handleChange}
            placeholder="e.g., 3.7 sec"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Transmission</label>
        <input
          type="text"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          placeholder="e.g., PDK Automatic"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        />
      </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Vehicle'}
        </motion.button>
    </motion.form>
  );
}

// Gallery Form Component
function GalleryFormComponent({
  uploadedImage,
  onImageUpload,
  uploading,
  onSuccess,
}: {
  uploadedImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    specs: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) {
      toast.error('Please upload an image');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: uploadedImage,
        }),
      });

      if (response.ok) {
        toast.success('Gallery item added successfully!');
        onSuccess();
      } else {
        toast.error('Failed to add gallery item');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add gallery item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 bg-secondary/50 p-8 rounded-lg border border-border"
    >
      <h2 className="text-2xl font-bold text-foreground">Add Gallery Item</h2>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Gallery Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && <p className="text-muted-foreground">Uploading...</p>}
        </div>
        {uploadedImage && (
          <img src={uploadedImage} alt="Preview" className="mt-4 h-40 object-cover rounded-lg" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Gallery item title"
          required
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Vehicle brand"
          required
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the gallery image"
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Specifications</label>
        <textarea
          name="specs"
          value={formData.specs}
          onChange={handleChange}
          placeholder="Vehicle specifications"
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add to Gallery'}
      </motion.button>
    </motion.form>
  );
}

// Edit Vehicle Modal Component
function EditVehicleModal({
  vehicle,
  onClose,
  onSuccess,
}: {
  vehicle: EditingVehicle;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: vehicle.name || '',
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    category: vehicle.category || 'sports',
    year: vehicle.year || new Date().getFullYear(),
    price: vehicle.price || 0,
    description: vehicle.description || '',
    engine: vehicle.specifications?.engine || '',
    horsepower: vehicle.specifications?.horsepower || 0,
    topSpeed: vehicle.specifications?.topSpeed || 0,
    acceleration: vehicle.specifications?.acceleration || '',
    transmission: vehicle.specifications?.transmission || '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [vehicleImage, setVehicleImage] = useState(vehicle.image);
  const [cloudinaryId, setCloudinaryId] = useState(vehicle.cloudinaryId || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['year', 'price', 'horsepower', 'topSpeed'].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);

    try {
      // Delete old image from Cloudinary first if cloudinaryId exists
      if (cloudinaryId) {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: cloudinaryId }),
        });
      }

      // Upload new image
      const formDataUpload = new FormData();
      formDataUpload.append('file', e.target.files[0]);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      setVehicleImage(data.secure_url);
      setCloudinaryId(data.public_id); // Store the public_id for future deletion
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/vehicles/${vehicle._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: vehicleImage,
          cloudinaryId: cloudinaryId,
          specifications: {
            engine: formData.engine,
            horsepower: formData.horsepower,
            topSpeed: formData.topSpeed,
            acceleration: formData.acceleration,
            transmission: formData.transmission,
          },
        }),
      });

      if (response.ok) {
        toast.success('Vehicle updated successfully!');
        onSuccess();
      } else {
        toast.error('Failed to update vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-secondary/50 border border-border rounded-lg p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit Vehicle</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-all text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Vehicle Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <p className="text-muted-foreground">Uploading...</p>}
            </div>
            {vehicleImage && (
              <img src={vehicleImage} alt="Vehicle preview" className="mt-4 h-40 object-cover rounded-lg" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Porsche"
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., 911"
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Model"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              >
                <option value="sports">Sports</option>
                <option value="luxury">Luxury</option>
                <option value="suv">SUV</option>
                <option value="convertible">Convertible</option>
                <option value="exotic">Exotic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price (PKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the vehicle"
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Engine</label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="e.g., 3.0L Twin-Turbo"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Horsepower</label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                placeholder="Horsepower"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Top Speed (mph)</label>
              <input
                type="number"
                name="topSpeed"
                value={formData.topSpeed}
                onChange={handleChange}
                placeholder="Top Speed"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Acceleration (0-100)</label>
              <input
                type="text"
                name="acceleration"
                value={formData.acceleration}
                onChange={handleChange}
                placeholder="e.g., 3.7 sec"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Transmission</label>
            <input
              type="text"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              placeholder="e.g., PDK Automatic"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Vehicle'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 px-6 py-3 bg-secondary text-foreground font-bold rounded-lg hover:bg-secondary/80 transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
