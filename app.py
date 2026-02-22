import os
import re
from flask import Flask, request, jsonify, render_template, send_file
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from io import BytesIO

app = Flask(__name__)

def extract_video_id(url):
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'youtu.be\/([0-9A-Za-z_-]{11})',
        r'embed\/([0-9A-Za-z_-]{11})',
        r'shorts\/([0-9A-Za-z_-]{11})'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/verify', methods=['POST'])
def verify_video():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'La URL es obligatoria'}), 400
    
    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({'error': 'URL de YouTube inválida'}), 400

    try:
        # Use yt-dlp only for basic video info
        ydl_opts = {'quiet': True, 'no_warnings': True, 'skip_download': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            subtitles = []
            try:
                api = YouTubeTranscriptApi()
                all_transcripts = list(api.list(video_id))
                
                # Priority: automatic (generated) transcripts
                for t in all_transcripts:
                    if t.is_generated:
                        subtitles.append({
                            'code': t.language_code,
                            'name': f"{t.language} (Automático)"
                        })
                
                # Fallback: if no automatic found, show manual ones
                if not subtitles:
                    for t in all_transcripts:
                        subtitles.append({
                            'code': t.language_code,
                            'name': f"{t.language} (Manual)"
                        })
                            
            except Exception as e:
                print(f"Error listing transcripts for {video_id}: {str(e)}")

            return jsonify({
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'author': info.get('uploader'),
                'view_count': info.get('view_count'),
                'video_id': video_id,
                'subtitles': subtitles
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/subtitles', methods=['POST'])
def download_subtitles():
    data = request.json
    url = data.get('url')
    lang = data.get('lang', 'es')
    
    if not url:
        return jsonify({'error': 'La URL es obligatoria'}), 400
    
    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({'error': 'URL de YouTube inválida'}), 400
    
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        transcript = transcript_list.find_transcript([lang]).fetch()
        
        output = ""
        for entry in transcript:
            text = entry.text if hasattr(entry, 'text') else entry['text']
            output += f"{text}\n"
        
        buffer = BytesIO()
        buffer.write(output.encode('utf-8'))
        buffer.seek(0)
        
        filename = f'subtitulos_{video_id}_{lang}.txt'
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='text/plain'
        )
    except Exception as e:
        print(f"Error downloading subtitles for {video_id} ({lang}): {str(e)}")
        return jsonify({'error': f"Error al recuperar los subtítulos: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
