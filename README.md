# Descargador de Subtítulos de YouTube

Una aplicación web profesional construida con Flask para verificar videos de YouTube y descargar sus subtítulos en varios idiomas.

## 🚀 Características

- **Verificación de Video**: Validación en tiempo real de URLs de YouTube usando `yt-dlp`.
- **Extracción de Metadatos**: Muestra el título del video, miniatura, autor, duración y número de vistas.
- **Descarga de Subtítulos**: Extrae y descarga subtítulos directamente de YouTube como archivos de texto.
- **Interfaz Limpia**: Interfaz moderna centrada en el desarrollador con retroalimentación tipo terminal.

## 🛠️ Stack Tecnológico

- **Backend**: Python, Flask
- **Extracción**: [yt-dlp](https://github.com/yt-dlp/yt-dlp), [youtube-transcript-api](https://github.com/jdepoortere/youtube-transcript-api)
- **Frontend**: HTML5, CSS puro (Vanilla CSS), JavaScript

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd videoyoutube
   ```

2. **Instalar dependencias**:
   ```bash
   pip install flask yt-dlp youtube-transcript-api
   ```

3. **Ejecutar la aplicación**:
   ```bash
   python app.py
   ```
   La aplicación estará disponible en `http://localhost:5000`.

## 📖 Uso

1. Ingrese una URL válida de YouTube en el campo de entrada.
2. Haga clic en "Verificar" para ver los detalles del video.
3. Seleccione el idioma deseado y haga clic en "Descargar Subtítulos" para obtener la transcripción.

## 📄 Licencia

Licencia MIT