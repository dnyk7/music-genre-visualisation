// Step 5: Spotify Genre Pie + Song Explorer (D3.js)
// This file is meant to be referenced by the merged group index.html.

(function () {
  const DATA_URL = "./DataCleaning/cleaned_spotify.csv";
  const GENRE_COLORS = {
    edm: '#1DB954',
    latin: '#F72585',
    pop: '#4CC9F0',
    'r&b': '#7B2D8B',
    rap: '#F77F00',
    rock: '#D62828'
  };
  const OTHER_COLOR = '#D1D5DB';
  const GENRE_DEFINITIONS = {
    rock: 'Originating in the United States during the 1950s, rock (or rock and roll) is defined by a strong, driving beat. It spread globally through the 1960s, evolving into a diverse cultural force. Characterized primarily by the electric guitar, it remains one of the most impactful forms of popular music.',
    edm: 'EDM is an umbrella term for various styles like house, techno, and dubstep that emerged in the mid-1980s. Defined by inorganic sounds, synthesizers, and samples, it emphasizes heavy rhythmic patterns. While primarily produced for club environments and DJ sets, many tracks have successfully crossed over into mainstream pop.',
    rap: 'Emerging from African American communities in New York City, rap features rhythmic or rhyming speech chanted over musical accompaniment. It is a core pillar of hip-hop culture, which includes deejaying and breakdancing. Since the late 1970s, it has evolved from underground expression to a dominant global commercial force.',
    latin: 'This genre encompasses the traditions of Mexico, Central and South America, and the Caribbean. It represents a vibrant fusion of Native American, African, and European influences. Known for its sophisticated use of percussion, Latin music balances deep-rooted folk and religious traditions with modern, evolving international trends.',
    'r&b': 'Coined in 1947, R&B describes African American popular music that evolved from urban blues and boogie-woogie. Originally characterized by jump blues and humorous lyrics, it later integrated electric blues and jazz influences. It served as a foundational building block for both rock and roll and modern soul music.',
    pop: 'Pop is commercially oriented music designed for a broad, urban audience in technologically advanced societies. Unlike folk music, which evolves through oral tradition, pop is created by professional songwriters and performers. It prioritizes accessibility, catchy melodies, and wide distribution through mass media and digital platforms.'
  };

  const state = {
    rows: [],
    uniqueSongs: [],
    genreCounts: [],
    query: '',
    filteredSongs: [],
    selectedSong: null,
    activeGenreOverride: null
  };

  function firstNonEmpty(row, keys, fallback = '') {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
        return row[key];
      }
    }
    return fallback;
  }

  function num(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalizeText(s) {
    return String(s || '').trim().toLowerCase();
  }

  function normalizeGenre(g) {
    return normalizeText(g).replace(/&amp;/g, '&');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function aggregateSongsByTrackId(rows) {
    const map = new Map();
    for (const row of rows) {
      if (!row.track_id) continue;
      const genre = String(row.genre || '').trim();
      if (!map.has(row.track_id)) {
        map.set(row.track_id, { ...row, genres: genre ? [genre] : [] });
      } else {
        const existing = map.get(row.track_id);
        if (genre && !existing.genres.some(g => normalizeGenre(g) === normalizeGenre(genre))) {
          existing.genres.push(genre);
        }
      }
    }
    return Array.from(map.values()).map(song => ({
      ...song,
      genres: song.genres.sort((a, b) => d3.ascending(normalizeGenre(a), normalizeGenre(b)))
    }));
  }

  function genreColor(genre, activeGenres) {
    const norm = normalizeGenre(genre);
    const hasActive = Array.isArray(activeGenres) && activeGenres.length > 0;
    if (hasActive) {
      return activeGenres.includes(norm) ? (GENRE_COLORS[norm] || '#1DB954') : OTHER_COLOR;
    }
    return GENRE_COLORS[norm] || '#94A3B8';
  }

  function getActiveGenres() {
    if (Array.isArray(state.activeGenreOverride) && state.activeGenreOverride.length > 0) {
      return state.activeGenreOverride;
    }
    if (!state.query.trim() || !state.selectedSong) return [];
    if (Array.isArray(state.selectedSong.genres) && state.selectedSong.genres.length > 0) {
      return state.selectedSong.genres.map(normalizeGenre);
    }
    return state.selectedSong.genre ? [normalizeGenre(state.selectedSong.genre)] : [];
  }

  function formatGenreTitle(genre) {
    const norm = normalizeGenre(genre);
    if (norm === 'edm') return 'Electronic Dance Music (EDM)';
    if (norm === 'latin') return 'Latin American Music';
    if (norm === 'pop') return 'Popular Music (Pop)';
    if (norm === 'r&b') return 'Rhythm and Blues (R&B)';
    if (norm === 'rap') return 'Rap';
    if (norm === 'rock') return 'Rock';
    return genre;
  }

  function getOrderedGenresForBoxes(activeGenres) {
    const allGenres = state.genreCounts.map(d => d.genre);
    if (!activeGenres || activeGenres.length === 0) return allGenres;
    const selected = [];
    const others = [];
    allGenres.forEach(genre => {
      if (activeGenres.includes(normalizeGenre(genre))) selected.push(genre);
      else others.push(genre);
    });
    return [...selected, ...others];
  }

  function renderGenreDefinitionBoxes() {
    const container = document.getElementById('step5-genre-definitions');
    if (!container) return;
    const activeGenres = getActiveGenres();
    const orderedGenres = getOrderedGenresForBoxes(activeGenres);
    container.innerHTML = '';

    orderedGenres.forEach(genre => {
      const norm = normalizeGenre(genre);
      const active = activeGenres.length === 0 ? false : activeGenres.includes(norm);
      const borderColor = activeGenres.length === 0
        ? (GENRE_COLORS[norm] || '#CBD5E1')
        : (active ? (GENRE_COLORS[norm] || '#CBD5E1') : OTHER_COLOR);
      const titleColor = activeGenres.length === 0
        ? (GENRE_COLORS[norm] || '#334155')
        : (active ? (GENRE_COLORS[norm] || '#334155') : '#6B7280');

      const box = document.createElement('div');
      box.className = 'step5-genre-box' + (active ? ' active' : '');
      box.style.borderColor = borderColor;
      box.innerHTML = `
        <div class="step5-genre-box-title" style="color:${titleColor}">${escapeHtml(formatGenreTitle(genre))}</div>
        <div class="step5-genre-box-definition">${escapeHtml(GENRE_DEFINITIONS[norm] || 'Definition unavailable.')}</div>
      `;
      container.appendChild(box);
    });
  }

  function renderPieChart() {
    const svg = d3.select('#step5-pie-chart');
    const legend = d3.select('#step5-pie-legend');
    const data = state.genreCounts;
    svg.selectAll('*').remove();
    legend.selectAll('*').remove();

    const activeGenres = getActiveGenres();
    const width = 420;
    const height = 420;
    const radius = Math.min(width, height) / 2 - 18;
    const pie = d3.pie().sort(null).value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.64).outerRadius(radius * 0.64);
    const total = d3.sum(data, d => d.count);

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all')
      .on('click', () => {
        state.activeGenreOverride = null;
        renderAll();
      });

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);
    const arcs = pie(data);

    g.selectAll('path.slice')
      .data(arcs)
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('transform', d => {
        const isActive = activeGenres.includes(normalizeGenre(d.data.genre));
        if (!isActive) return 'translate(0,0)';
        const [x, y] = arc.centroid(d);
        const len = Math.sqrt(x * x + y * y) || 1;
        const off = 18;
        return `translate(${(x / len) * off},${(y / len) * off})`;
      })
      .attr('fill', d => genreColor(d.data.genre, activeGenres))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => activeGenres.includes(normalizeGenre(d.data.genre)) ? 3 : 2)
      .on('click', function (event, d) {
        event.stopPropagation();
        const clicked = normalizeGenre(d.data.genre);
        if (state.activeGenreOverride && state.activeGenreOverride.length === 1 && state.activeGenreOverride[0] === clicked) {
          state.activeGenreOverride = null;
        } else {
          state.activeGenreOverride = [clicked];
        }
        renderAll();
      })
      .append('title')
      .text(d => `${d.data.genre}: ${d.data.count}`);

    g.selectAll('text.label')
      .data(arcs.filter(d => d.endAngle - d.startAngle > 0.18))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', d => {
        const [x0, y0] = labelArc.centroid(d);
        const isActive = activeGenres.includes(normalizeGenre(d.data.genre));
        if (!isActive) return `translate(${x0}, ${y0})`;
        const len = Math.sqrt(x0 * x0 + y0 * y0) || 1;
        const off = 18;
        return `translate(${x0 + (x0 / len) * off}, ${y0 + (y0 / len) * off})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'white')
      .style('font-size', '13px')
      .style('font-weight', 700)
      .style('pointer-events', 'none')
      .each(function (d) {
        const text = d3.select(this);
        const pct = total ? ((d.data.count / total) * 100).toFixed(1) : '0.0';
        text.append('tspan').attr('x', 0).attr('dy', 0).text(d.data.genre);
        text.append('tspan').attr('x', 0).attr('dy', '1.15em').text(`${pct}%`);
      });

    const items = legend.selectAll('div.step5-legend-item').data(data).enter().append('div').attr('class', 'step5-legend-item');
    items.append('span').attr('class', 'step5-legend-color').style('background-color', d => genreColor(d.genre, activeGenres));
    items.append('span').attr('class', 'step5-legend-text').text(d => `${d.genre}: ${d.count}`);

    renderGenreDefinitionBoxes();
  }

  function renderSearchList() {
    const container = document.getElementById('step5-search-list-content');
    if (!container) return;
    container.innerHTML = '';
    if (state.query.trim() === '') {
      container.className = 'step5-hint';
      container.textContent = 'Start typing to search for a song.';
      return;
    }
    if (state.filteredSongs.length === 0) {
      container.className = 'step5-no-result';
      container.textContent = "Sorry, we don't know have this song.";
      return;
    }
    container.className = '';
    state.filteredSongs.forEach(song => {
      const button = document.createElement('button');
      button.className = 'step5-song-btn' + (state.selectedSong && state.selectedSong.track_id === song.track_id ? ' active' : '');
      button.type = 'button';
      button.innerHTML = `
        <div class="step5-song-title">${escapeHtml(song.song_name)}</div>
        <div class="step5-song-subtitle">${escapeHtml(song.artists || 'Unknown artist')} ${song.year ? `(${escapeHtml(song.year)})` : ''}</div>
      `;
      button.addEventListener('click', () => {
        state.selectedSong = song;
        state.activeGenreOverride = null;
        renderAll();
      });
      container.appendChild(button);
    });
  }

  function renderSongInfo() {
    const el = document.getElementById('step5-song-info-content');
    if (!el) return;
    const song = state.selectedSong;
    if (!song) {
      el.className = 'step5-hint';
      el.textContent = 'No song selected.';
      return;
    }
    const genres = Array.isArray(song.genres) && song.genres.length > 0 ? song.genres.join(', ') : (song.genre || 'Unknown');
    const popularityValue = Number.isFinite(num(song.popularity, NaN)) ? Math.round(num(song.popularity)) : null;
    el.className = '';
    el.innerHTML = `
      <div class="step5-song-info-title">${escapeHtml(song.song_name)}</div>
      <div class="step5-song-info-meta">${escapeHtml(song.artists || 'Unknown artist')} ${song.year ? `(${escapeHtml(song.year)})` : ''}</div>
      <div class="step5-song-info-genre">Genres: ${escapeHtml(genres)}</div>
      <div class="step5-song-info-popularity">Popularity: ${popularityValue !== null ? popularityValue : 'N/A'}</div>
    `;
  }

  function renderSpotifyButton() {
    const link = document.getElementById('step5-spotify-link');
    if (!link) return;
    if (state.selectedSong && state.selectedSong.track_id) {
      link.href = `https://open.spotify.com/track/${state.selectedSong.track_id}`;
      link.classList.remove('disabled');
    } else {
      link.href = '#';
      link.classList.add('disabled');
    }
  }

  function renderRadarChart() {
    const root = d3.select('#step5-radar-chart-area');
    root.selectAll('*').remove();
    const song = state.selectedSong;
    if (!song) {
      root.append('div').attr('class', 'step5-hint').style('text-align', 'center').text('Search and select a song to view its radar chart.');
      return;
    }

    const size = 360;
    const center = size / 2;
    const radius = 112;
    const levels = 5;
    const features = [
      { key: 'danceability', label: 'Danceability', value: num(song.danceability) },
      { key: 'energy', label: 'Energy', value: num(song.energy) },
      { key: 'speechiness', label: 'Speechiness', value: num(song.speechiness) },
      { key: 'acousticness', label: 'Acousticness', value: num(song.acousticness) },
      { key: 'valence', label: 'Valence', value: num(song.valence) }
    ];

    const angleSlice = (Math.PI * 2) / features.length;
    const pointAt = (angle, r) => [center + Math.cos(angle - Math.PI / 2) * r, center + Math.sin(angle - Math.PI / 2) * r];
    const svg = root.append('svg').attr('width', size).attr('height', size).attr('viewBox', `0 0 ${size} ${size}`).style('overflow', 'visible');

    for (let level = 1; level <= levels; level++) {
      const r = (radius * level) / levels;
      const pts = features.map((_, i) => pointAt(i * angleSlice, r));
      svg.append('path').attr('d', d3.line().curve(d3.curveLinearClosed)(pts)).attr('fill', 'none').attr('stroke', '#cbd5e1').attr('stroke-width', 1);
    }

    features.forEach((feature, i) => {
      const [x, y] = pointAt(i * angleSlice, radius);
      const [lx, ly] = pointAt(i * angleSlice, radius + 18);
      svg.append('line').attr('x1', center).attr('y1', center).attr('x2', x).attr('y2', y).attr('stroke', '#cbd5e1').attr('stroke-width', 1);
      svg.append('text').attr('x', lx).attr('y', ly).attr('text-anchor', Math.abs(lx - center) < 8 ? 'middle' : lx < center ? 'end' : 'start').attr('dominant-baseline', 'middle').attr('fill', '#334155').style('font-size', '12px').text(feature.label);
    });

    const points = features.map((f, i) => pointAt(i * angleSlice, radius * Math.max(0, Math.min(1, f.value))));
    svg.append('path').attr('d', d3.line().curve(d3.curveLinearClosed)(points)).attr('fill', 'rgba(59,130,246,0.22)').attr('stroke', '#3b82f6').attr('stroke-width', 2.5);
    svg.selectAll('circle.point').data(points).enter().append('circle').attr('cx', d => d[0]).attr('cy', d => d[1]).attr('r', 4).attr('fill', '#2563eb');
    svg.append('circle').attr('cx', center).attr('cy', center).attr('r', 2.5).attr('fill', '#64748b');

    const values = root.append('div').attr('class', 'step5-radar-values');
    values.html(`
      <div class="step5-value-row"><span>Danceability</span><span>${num(song.danceability).toFixed(2)}</span></div>
      <div class="step5-value-row"><span>Energy</span><span>${num(song.energy).toFixed(2)}</span></div>
      <div class="step5-value-row"><span>Valence</span><span>${num(song.valence).toFixed(2)}</span></div>
      <div class="step5-value-row"><span>Acousticness</span><span>${num(song.acousticness).toFixed(2)}</span></div>
      <div class="step5-value-row"><span>Speechiness</span><span>${num(song.speechiness).toFixed(2)}</span></div>
    `);
  }

  function updateFilteredSongs() {
    const q = normalizeText(state.query);
    if (!q) {
      state.filteredSongs = [];
      state.selectedSong = state.uniqueSongs.length > 0 ? state.uniqueSongs[0] : null;
      return;
    }
    state.filteredSongs = state.uniqueSongs.filter(d => normalizeText(d.song_name).includes(q)).sort((a, b) => {
      const yearA = Number(a.year), yearB = Number(b.year);
      const validA = Number.isFinite(yearA), validB = Number.isFinite(yearB);
      if (validA && validB) {
        const byYear = d3.ascending(yearA, yearB);
        if (byYear !== 0) return byYear;
      } else if (validA && !validB) return -1;
      else if (!validA && validB) return 1;
      const byName = d3.ascending(a.song_name, b.song_name);
      if (byName !== 0) return byName;
      return d3.ascending(a.artists || '', b.artists || '');
    }).slice(0, 50);

    if (state.filteredSongs.length > 0) {
      const currentStillVisible = state.selectedSong && state.filteredSongs.some(s => s.track_id === state.selectedSong.track_id);
      if (!currentStillVisible) state.selectedSong = state.filteredSongs[0];
    } else {
      state.selectedSong = null;
    }
  }

  function renderAll() {
    renderPieChart();
    renderSearchList();
    renderSongInfo();
    renderRadarChart();
    renderSpotifyButton();
  }

  async function initStep5() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`Failed to load CSV: ${response.status}`);
      const text = await response.text();
      state.rows = d3.csvParse(text, d => ({
        track_id: String(firstNonEmpty(d, ['track_id', 'id', 'spotify_id'])),
        song_name: String(firstNonEmpty(d, ['track_name', 'song_name', 'name', 'title'])),
        artists: String(firstNonEmpty(d, ['track_artist', 'artists', 'artist', 'artist_name'])),
        year: String(firstNonEmpty(d, ['year', 'release_year', 'released_year'])),
        genre: String(firstNonEmpty(d, ['playlist_genre', 'genre', 'track_genre'], 'Unknown')),
        popularity: num(firstNonEmpty(d, ['track_popularity', 'popularity', 'spotify_popularity']), NaN),
        danceability: num(firstNonEmpty(d, ['danceability'])),
        energy: num(firstNonEmpty(d, ['energy'])),
        valence: num(firstNonEmpty(d, ['valence'])),
        acousticness: num(firstNonEmpty(d, ['acousticness'])),
        speechiness: num(firstNonEmpty(d, ['speechiness']))
      })).filter(d => d.track_id && d.song_name);

      state.uniqueSongs = aggregateSongsByTrackId(state.rows);
      state.genreCounts = d3.rollups(state.rows, v => v.length, d => d.genre || 'Unknown')
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => d3.descending(a.count, b.count));
      state.selectedSong = state.uniqueSongs.length > 0 ? state.uniqueSongs[0] : null;
      renderAll();

      const input = document.getElementById('step5-search-input');
      if (input) {
        input.addEventListener('input', e => {
          state.query = e.target.value;
          state.activeGenreOverride = null;
          updateFilteredSongs();
          renderAll();
        });
      }
    } catch (error) {
      console.error('Step 5 failed to load:', error);
      const list = document.getElementById('step5-search-list-content');
      if (list) {
        list.className = 'step5-no-result';
        list.textContent = 'Step 5 failed to load data.';
      }
    }
  }

  if (document.getElementById('step5')) {
    initStep5();
  }
})();
