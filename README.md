# YouTube Subtitle Downloader

A professional web application built with Flask to verify YouTube videos and download their subtitles in various languages.

## 🚀 Features

- **Video Verification**: Real-time validation of YouTube URLs using `yt-dlp`.
- **Metadata Extraction**: Displays video title, thumbnail, author, duration, and view count.
- **Subtitle Download**: Extracts and downloads subtitles directly from YouTube as text files.
- **Clean UI**: Modern, developer-centric interface with terminal-like feedback.

## 🛠️ Tech Stack

- **Backend**: Python, Flask
- **Extraction**: [yt-dlp](https://github.com/yt-dlp/yt-dlp), [youtube-transcript-api](https://github.com/jdepoortere/youtube-transcript-api)
- **Frontend**: HTML5, Vanilla CSS, JavaScript

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd videoyoutube
   ```

2. **Install dependencies**:
   ```bash
   pip install flask yt-dlp youtube-transcript-api
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```
   The app will be available at `http://localhost:5000`.

## 📖 Usage

1. Enter a valid YouTube URL in the input field.
2. Click "Verificar" to see video details.
3. Select the desired language and click "Descargar Subtítulos" to obtain the transcript.

## 📄 License

MIT License