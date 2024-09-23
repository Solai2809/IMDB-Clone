import React, { useState, useEffect } from 'react';

// Movies Component
const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [movieForm, setMovieForm] = useState({
    name: '',
    yearOfRelease: '',
    producerId: '',
    actorIds: [],
    newActors: [],
    newProducer: '',
  });

  const [editingMovieId, setEditingMovieId] = useState(null);

  // Fetch movies, actors, and producers when component loads
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movieRes, actorRes, producerRes] = await Promise.all([
        fetch('http://localhost:3000/movies'),
        fetch('http://localhost:3000/actors'),
        fetch('http://localhost:3000/producers'),
      ]);

      const [moviesData, actorsData, producersData] = await Promise.all([
        movieRes.json(),
        actorRes.json(),
        producerRes.json(),
      ]);

      setMovies(moviesData);
      setActors(actorsData);
      setProducers(producersData);
      setLoading(false);
      console.log(moviesData);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieForm({ ...movieForm, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const { options } = e.target;
    const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
    setMovieForm({ ...movieForm, actorIds: selectedValues });
  };

  const handleNewActorChange = (index, e) => {
    const newActors = [...movieForm.newActors];
    newActors[index] = e.target.value;
    setMovieForm({ ...movieForm, newActors });
  };

  const addNewActorField = () => {
    setMovieForm({ ...movieForm, newActors: [...movieForm.newActors, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add new actors and producer if provided
    let newActorIds = [];
    if (movieForm.newActors.length > 0) {
      const newActorRequests = movieForm.newActors.map(async (actorName) => {
        const response = await fetch('http://localhost:3000/actors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: actorName }),
        });
        const data = await response.json();
        return data.id; // Get newly created actor ID
      });

      newActorIds = await Promise.all(newActorRequests);
    }

    let newProducerId = '';
    if (movieForm.newProducer) {
      const response = await fetch('http://localhost:3000/producers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: movieForm.newProducer }),
      });
      const data = await response.json();
      newProducerId = data.id; // Get newly created producer ID
    }

    const movieData = {
      name: movieForm.name,
      yearOfRelease: movieForm.yearOfRelease,
      producerId: newProducerId || movieForm.producerId,
      actorIds: [...movieForm.actorIds, ...newActorIds],
    };

    if (editingMovieId) {
      // Edit existing movie
      const response = await fetch(`http://localhost:3000/movies/${editingMovieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
      });
      const updatedMovie = await response.json();
      setMovies(movies.map(movie => (movie.id === editingMovieId ? updatedMovie : movie)));
    } else {
      // Add new movie
      const response = await fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
      });
      const newMovie = await response.json();
      setMovies([...movies, newMovie]);
    }

    fetchData();
    clearForm();
  };

  const clearForm = () => {
    setMovieForm({
      name: '',
      yearOfRelease: '',
      producerId: '',
      actorIds: [],
      newActors: [],
      newProducer: '',
    });
    setEditingMovieId(null);
  };

  const handleEdit = (movie) => {
    setMovieForm({
      name: movie.name,
      yearOfRelease: movie.yearOfRelease,
      producerId: movie.producerId,
      actorIds: movie.Actors.map(actor => actor.id),
      newActors: [],
      newProducer: '',
    });
    setEditingMovieId(movie.id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Movies</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <strong>{movie.name}</strong> ({movie.yearOfRelease}) by <strong>{movie.Producer ? movie.Producer.name : 'Unknown Producer'}</strong>
            <br />
            Actors: {movie.Actors.map(actor => actor.name).join(', ')}
            <button onClick={() => handleEdit(movie)}>Edit</button>
          </li>
        ))}
      </ul>

      <h2>{editingMovieId ? 'Edit Movie' : 'Add Movie'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie Name:</label>
          <input type="text" name="name" value={movieForm.name} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Year of Release:</label>
          <input type="number" name="yearOfRelease" value={movieForm.yearOfRelease} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Producer (Existing):</label>
          <select name="producerId" value={movieForm.producerId} onChange={handleInputChange}>
            <option value="">Select Producer</option>
            {producers.map(producer => (
              <option key={producer.id} value={producer.id}>
                {producer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>New Producer (if not in the list):</label>
          <input type="text" name="newProducer" value={movieForm.newProducer} onChange={handleInputChange} />
        </div>

        <div>
          <label>Actors (Existing):</label>
          <select name="actorIds" multiple={true} value={movieForm.actorIds} onChange={handleMultiSelectChange}>
            {actors.map(actor => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>New Actors (if not in the list):</label>
          {movieForm.newActors.map((actor, index) => (
            <input
              key={index}
              type="text"
              value={actor}
              onChange={(e) => handleNewActorChange(index, e)}
            />
          ))}
          <button type="button" onClick={addNewActorField}>+ Add Another Actor</button>
        </div>

        <button type="submit">{editingMovieId ? 'Update Movie' : 'Add Movie'}</button>
        {editingMovieId && <button type="button" onClick={clearForm}>Cancel</button>}
      </form>
    </div>
  );
};

export default Movies;
