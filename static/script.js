document.addEventListener('DOMContentLoaded', () => {
    const videoUrl = document.getElementById('videoUrl');
    const videoLang = document.getElementById('videoLang');
    const verifyBtn = document.getElementById('verifyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultCard = document.getElementById('resultCard');

    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const videoAuthor = document.getElementById('videoAuthor');
    const videoDuration = document.getElementById('videoDuration');
    const videoViews = document.getElementById('videoViews');

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViews = (views) => {
        if (!views) return '0 vistas';
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M vistas`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K vistas`;
        return `${views} vistas`;
    };

    const setLoading = (isLoading, btn) => {
        if (isLoading) {
            btn.disabled = true;
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = '<span>⏳</span> Cargando...';
        } else {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.originalText || (btn.id === 'verifyBtn' ? '<span>🔍</span> Verificar Video' : '<span>⬇️</span> Descargar Subtítulos');
        }
    };

    verifyBtn.addEventListener('click', async () => {
        const url = videoUrl.value.trim();
        if (!url) {
            errorMessage.textContent = 'Por favor, introduce una URL de YouTube.';
            return;
        }

        errorMessage.textContent = '';
        setLoading(true, verifyBtn);
        resultCard.classList.add('hidden');

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (data.error) {
                errorMessage.textContent = data.error;
            } else {
                // Fill result card
                videoThumbnail.src = data.thumbnail;
                videoTitle.textContent = data.title;
                videoAuthor.textContent = `👤 ${data.author}`;
                videoDuration.textContent = `⏱️ ${formatDuration(data.duration)}`;
                videoViews.textContent = `👁️ ${formatViews(data.view_count)}`;

                // Populate languages
                videoLang.innerHTML = '';
                if (data.subtitles && data.subtitles.length > 0) {
                    data.subtitles.forEach(sub => {
                        const option = document.createElement('option');
                        option.value = sub.code;
                        option.textContent = sub.name;
                        videoLang.appendChild(option);
                    });
                    videoLang.disabled = false;
                    downloadBtn.disabled = false;
                } else {
                    const option = document.createElement('option');
                    option.value = "";
                    option.textContent = "No se encontraron subtítulos";
                    videoLang.appendChild(option);
                    videoLang.disabled = true;
                    downloadBtn.disabled = true;
                }

                resultCard.classList.remove('hidden');
            }
        } catch (err) {
            errorMessage.textContent = 'Error de conexión con el servidor.';
        } finally {
            setLoading(false, verifyBtn);
        }
    });

    downloadBtn.addEventListener('click', async () => {
        const url = videoUrl.value.trim();
        const lang = videoLang.value;

        if (!url || !lang) return;

        errorMessage.textContent = '';
        setLoading(true, downloadBtn);

        try {
            const response = await fetch('/api/subtitles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, lang })
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;

                // Get filename from header if possible
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = `subtitulos_${lang}.txt`;
                if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
                    filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
                }

                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
                a.remove();
            } else {
                const data = await response.json();
                errorMessage.textContent = data.error || 'Error al descargar los subtítulos.';
            }
        } catch (err) {
            errorMessage.textContent = 'Error al intentar descargar.';
        } finally {
            setLoading(false, downloadBtn);
        }
    });
});
