import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/card';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/Alert';
import { Plus, Archive, Save, X } from 'lucide-react';
import {
  fetchPresenters,
  fetchShows,
  updatePresenter,
  archivePresenter,
  uploadPresenterImage,
  updateShow,
  createShow,
  archiveShow
} from '../services/admin';

interface Presenter {
  id: string;
  name: string;
  bio: string;
  image: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Show {
  id: string;
  name: string;
  time: string;
  presenter: string;
  synopsis: string;
  scheduleType: 'weekday' | 'friday' | 'weekend';
}

interface EditState {
  [key: string]: boolean;
}

const AdminDashboard: React.FC = () => {
  const [presenters, setPresenters] = useState<Record<string, Presenter>>({});
  const [shows, setShows] = useState<{
    weekday: Show[];
    friday: Show[];
    weekend: Show[];
  }>({
    weekday: [],
    friday: [],
    weekend: []
  });
  const [activeTab, setActiveTab] = useState<'presenters' | 'shows'>('presenters');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [editMode, setEditMode] = useState<EditState>({});
  const [newPresenter, setNewPresenter] = useState<Presenter | null>(null);
  const [newShow, setNewShow] = useState<Show | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [presenterData, showData] = await Promise.all([
        fetchPresenters(),
        fetchShows()
      ]);
      setPresenters(presenterData);
      setShows(showData);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (presenterName: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        try {
          const imageUrl = await uploadPresenterImage(presenterName, target.files[0]);
          if (presenterName === 'new' && newPresenter) {
            setNewPresenter({ ...newPresenter, image: imageUrl });
          } else {
            setPresenters({
              ...presenters,
              [presenterName]: {
                ...presenters[presenterName],
                image: imageUrl
              }
            });
          }
          setSuccess('Image uploaded successfully');
          setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
          setError('Failed to upload image');
        }
      }
    };
    
    input.click();
  };

  const handleAddPresenter = () => {
    setNewPresenter({
      id: `temp-${Date.now()}`,
      name: '',
      bio: '',
      image: '/api/placeholder/150/150',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const handleSavePresenter = async (presenterName: string, data: Partial<Presenter>) => {
    try {
      await updatePresenter(presenterName, {
        ...data,
        updatedAt: new Date()
      });
      
      setPresenters(prev => ({
        ...prev,
        [presenterName]: {
          ...prev[presenterName],
          ...data,
          updatedAt: new Date()
        }
      }));
      
      setSuccess('Presenter updated successfully');
      setEditMode(prev => ({ ...prev, [presenterName]: false }));
      
      if (newPresenter?.name === presenterName) {
        setNewPresenter(null);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update presenter');
    }
  };
  const handleArchivePresenter = async (presenterId: string) => {
    if (!window.confirm('Are you sure you want to archive this presenter?')) {
      return;
    }
  
    try {
      await archivePresenter(presenterId);
      setPresenters(prev => {
        const { [presenterId]: removed, ...remaining } = prev;
        return remaining;
      });
      setSuccess('Presenter archived successfully');
      setTimeout(() => setSuccess(''), 3000);
  
      // Reload shows to update any shows with this presenter
      loadData();
    } catch (error) {
      setError('Failed to archive presenter');
    }
  };

  const renderPresenterCard = (name: string, data: Presenter) => (
    <Card key={name}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {name}
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleArchivePresenter(name)}
          >
            <Archive size={20} />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <img
              src={data.image}
              alt={name}
              className="w-32 h-32 object-cover rounded"
            />
            <button
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => handleImageUpload(name)}
            >
              Upload Image
            </button>
          </div>
          {editMode[name] ? (
            <>
              <textarea
                className="w-full p-2 border rounded"
                value={data.bio}
                onChange={(e) => setPresenters(prev => ({
                  ...prev,
                  [name]: { ...data, bio: e.target.value }
                }))}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleSavePresenter(name, data)}
                >
                  <Save size={20} />
                  Save
                </button>
                <button
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setEditMode(prev => ({ ...prev, [name]: false }))}
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{data.bio}</p>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setEditMode(prev => ({ ...prev, [name]: true }))}
              >
                Edit Bio
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const handleAddShow = () => {
    setNewShow({
      id: `new-${Date.now()}`,
      name: '',
      time: '',
      presenter: '',
      synopsis: '',
      scheduleType: 'weekday'
    });
  };

  const handleSaveShow = async (show: Show) => {
    try {
      if (show.id.startsWith('new-')) {
        await createShow(show);
      } else {
        await updateShow(show.id, show);
      }
      await loadData();
      setSuccess('Show saved successfully');
      setNewShow(null);
      setEditMode(prev => ({ ...prev, [show.name]: false }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save show');
    }
  };

  const handleArchiveShow = async (showId: string, scheduleType: 'weekday' | 'friday' | 'weekend') => {
    if (!window.confirm('Are you sure you want to archive this show?')) {
      return;
    }
  
    try {
      await archiveShow(showId);
      setShows(prev => ({
        ...prev,
        [scheduleType]: prev[scheduleType].filter(show => show.id !== showId)
      }));
      setSuccess('Show archived successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to archive show');
    }
  };

  const renderShowCard = (show: Show) => (
    <Card key={show.id}>
      <CardHeader>
      <CardTitle className="flex justify-between items-center">
        {show.name}
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => handleArchiveShow(show.id, show.scheduleType)}
        >
          <Archive size={20} />
        </button>
      </CardTitle>
    </CardHeader>
      <CardContent>
        {editMode[show.name] ? (
          <div className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Show Name"
              value={show.name}
              onChange={(e) => {
                const updatedShow = { ...show, name: e.target.value };
                setShows(prev => ({
                  ...prev,
                  [show.scheduleType]: prev[show.scheduleType].map(s => 
                    s.id === show.id ? updatedShow : s
                  )
                }));
              }}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Time (e.g., 09:00 - 12:00)"
              value={show.time}
              onChange={(e) => {
                const updatedShow = { ...show, time: e.target.value };
                setShows(prev => ({
                  ...prev,
                  [show.scheduleType]: prev[show.scheduleType].map(s => 
                    s.id === show.id ? updatedShow : s
                  )
                }));
              }}
            />
            <select
              className="w-full p-2 border rounded"
              value={show.presenter}
              onChange={(e) => {
                const updatedShow = { ...show, presenter: e.target.value };
                setShows(prev => ({
                  ...prev,
                  [show.scheduleType]: prev[show.scheduleType].map(s => 
                    s.id === show.id ? updatedShow : s
                  )
                }));
              }}
            >
              <option value="">Select Presenter</option>
              {Object.keys(presenters).map(presenterName => (
                <option key={presenterName} value={presenterName}>
                  {presenterName}
                </option>
              ))}
            </select>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Synopsis"
              rows={4}
              value={show.synopsis}
              onChange={(e) => {
                const updatedShow = { ...show, synopsis: e.target.value };
                setShows(prev => ({
                  ...prev,
                  [show.scheduleType]: prev[show.scheduleType].map(s => 
                    s.id === show.id ? updatedShow : s
                  )
                }));
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleSaveShow(show)}
              >
                <Save size={20} />
                Save
              </button>
              <button
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setEditMode(prev => ({ ...prev, [show.name]: false }))}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">Time:</p>
              <p>{show.time}</p>
            </div>
            <div>
              <p className="font-medium">Presenter:</p>
              <p>{show.presenter}</p>
            </div>
            <div>
              <p className="font-medium">Synopsis:</p>
              <p>{show.synopsis}</p>
            </div>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setEditMode(prev => ({ ...prev, [show.name]: true }))}
            >
              Edit Show
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'presenters' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('presenters')}
          >
            Presenters
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'shows' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('shows')}
          >
            Shows
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {activeTab === 'presenters' ? (
        <div>
          <button
            className="mb-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAddPresenter}
          >
            <Plus size={20} />
            Add New Presenter
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newPresenter && renderPresenterCard('new', newPresenter)}
            {Object.entries(presenters).map(([name, data]) => 
              renderPresenterCard(name, data)
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            className="mb-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAddShow}
          >
            <Plus size={20} />
            Add New Show
          </button>

          {newShow && renderShowCard(newShow)}

          {Object.entries(shows).map(([scheduleType, scheduleShows]) => (
            <div key={scheduleType} className="space-y-4">
              <h2 className="text-xl font-semibold capitalize">
                {scheduleType} Shows
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheduleShows.map(show => renderShowCard(show))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;