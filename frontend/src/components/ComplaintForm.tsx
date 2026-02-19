import { useState } from 'react';
import { complaintService } from '../services/api';
import { Send, Mic, Image, CheckCircle } from 'lucide-react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_phone: '',
    complaint_text: '',
    location: '',
    language: 'en'
  });
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);

  const puneLocations = [
    'Shivaji Nagar, Pune',
    'Kothrud, Pune',
    'Deccan, Pune',
    'FC Road, Pune',
    'MG Road, Pune',
    'Camp, Pune',
    'Hadapsar, Pune',
    'Hinjewadi, Pune',
    'Wakad, Pune',
    'Baner, Pune',
    'Aundh, Pune',
    'Viman Nagar, Pune',
    'Koregaon Park, Pune',
    'Pimpri, Pune',
    'Chinchwad, Pune',
    'Katraj, Pune',
    'Swargate, Pune',
    'Bibwewadi, Pune',
    'Kondhwa, Pune',
    'Warje, Pune'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);
    if (audio) data.append('audio', audio);

    try {
      await complaintService.createComplaint(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ citizen_name: '', citizen_phone: '', complaint_text: '', location: '', language: 'en' });
        setImage(null);
        setAudio(null);
      }, 3000);
    } catch (error) {
      alert('Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudio(new File([blob], 'recording.webm', { type: 'audio/webm' }));
        setAudioRecorded(true);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);

      // Update timer every second
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
      }, 10000);
    } catch (error) {
      alert('Microphone access denied. Please allow microphone access to record audio.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUploaded(true);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <CheckCircle size={64} color="#10b981" />
        <h2>Complaint Submitted Successfully!</h2>
        <p>Your complaint has been registered and will be processed soon.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Submit Your Complaint</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={formData.citizen_name}
          onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.citizen_phone}
          onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
          required
        />
        <textarea
          placeholder="Describe your complaint..."
          value={formData.complaint_text}
          onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
          required
          rows={5}
        />
        <select
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        >
          <option value="">Select Location</option>
          {puneLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>

        <div className="file-inputs">
          <label className="file-label" style={{ borderColor: imageUploaded ? '#10b981' : '#e5e7eb' }}>
            <Image size={20} color={imageUploaded ? '#10b981' : '#666'} />
            <span>{imageUploaded ? '✓ Image Uploaded' : 'Upload Image'}</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          
          <button 
            type="button" 
            onClick={startRecording} 
            disabled={recording || audioRecorded} 
            className="record-btn"
            style={{ backgroundColor: audioRecorded ? '#10b981' : recording ? '#ef4444' : '#f59e0b' }}
          >
            <Mic size={20} />
            <span>
              {audioRecorded ? '✓ Audio Recorded' : recording ? `Recording... ${recordingTime}s` : 'Record Audio (10s)'}
            </span>
          </button>
        </div>

        {imageUploaded && (
          <div className="upload-success">
            ✓ Image uploaded: {image?.name}
          </div>
        )}

        {audioRecorded && (
          <div className="upload-success">
            ✓ Audio recorded successfully (10 seconds)
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          <Send size={20} />
          <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
        </button>
      </form>
    </div>
  );
}
