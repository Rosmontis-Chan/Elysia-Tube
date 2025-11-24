// pages/api/download-universal.js
import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL video tidak ditemukan. 🥺' });
  }

  // API Key Anda dari RapidAPI
  // SANGAT PENTING: Gunakan Environment Variable di Vercel!
  // Buat variabel lingkungan di Vercel: RAPIDAPI_KEY="837393c934msh8747bcb37b91d8ep1ba687jsn4ed59f6c1497"
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; 
  const RAPIDAPI_HOST = 'social-media-downloader-api.p.rapidapi.com'; // Contoh host RapidAPI, bisa berbeda

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'API Key RapidAPI tidak ditemukan di server. 😢' });
  }

  try {
    // Sesuaikan endpoint dan parameter dengan API RapidAPI yang Anda gunakan
    // Ini adalah CONTOH, Anda perlu membaca dokumentasi API RapidAPI Anda
    const options = {
      method: 'GET',
      url: `https://${RAPIDAPI_HOST}/api/some-download-endpoint`, // Ganti dengan endpoint RapidAPI yang benar
      params: { url: url },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    const apiData = response.data;

    // Logika untuk memproses data dari RapidAPI dan mengembalikan ke frontend
    // Struktur `apiData` akan sangat tergantung pada API RapidAPI yang Anda pilih
    // Anda harus mengadaptasi bagian ini sesuai dengan output API RapidAPI Anda
    const processedData = {
        title: apiData.title || 'Judul Tidak Tersedia',
        thumbnail: apiData.thumbnail || 'https://via.placeholder.com/150?text=No+Thumbnail',
        description: apiData.description || 'Tidak ada deskripsi.',
        formats: apiData.download_links ? apiData.download_links.map(link => ({
            quality: link.quality || 'N/A',
            container: link.type || 'mp4', // Asumsi default mp4
            url: link.url
        })) : [], // Pastikan ada fallback jika tidak ada link download
    };

    res.status(200).json(processedData);

  } catch (error) {
    console.error('Error calling RapidAPI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Gagal memproses video melalui API. Pastikan URL benar atau coba lagi nanti. 😢' });
  }
}
