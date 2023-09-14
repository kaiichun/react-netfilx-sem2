import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchMovies = async (genre, rating) => {
  // 3. trigger new API
  const response = await axios.get(
    "http://localhost:8080/movies?" +
      (genre !== "" ? "genre=" + genre : "") +
      (rating !== "" ? "&rating=" + rating : "")
  );
  return response.data; // movies data from express
};

const deleteMovie = async (movie_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:8080/movies" + movie_id,
  });
  return response.data;
};

function Movies() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  // const [genreOptions, setGenreOptions] = useState([]);
  // 4. movies data will be updated depending on the genre selected
  const {
    isLoading,
    isError,
    data: movies,
    error,
  } = useQuery({
    queryKey: ["movies", genre, rating], // 1. when genre changed
    queryFn: () => fetchMovies(genre, rating), // 2. call fetchMovies
  });

  // Method 1: extract genre from movies
  useEffect(() => {
    // if genre is not empty, we are not going to update the options
    if (genre === "") {
      let options = [];
      // loop through all the movies to get the genre from each movie
      if (movies && movies.length > 0) {
        movies.forEach((movie) => {
          // to make sure the genre wasn't already in the options
          if (!options.includes(movie.genre)) {
            options.push(movie.genre);
          }
        });
      }
      setGenreOptions(options);
    }
  }, [movies, genre]);

  // Method 2: extract genre from movies using useMemo
  // const memoryMovies = queryClient.getQueryData(["movies", "", ""]);
  // const genreOptions = useMemo(() => {
  //   let options = [];
  //   // loop through all the movies to get the genre from each movie
  //   if (memoryMovies && memoryMovies.length > 0) {
  //     memoryMovies.forEach((movie) => {
  //       // to make sure the genre wasn't already in the options
  //       if (!options.includes(movie.genre)) {
  //         options.push(movie.genre);
  //       }
  //     });
  //   }
  //   return options;
  // }, [memoryMovies]);

  // delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      // this will be triggered when API is successfully executed
      // ask the react query to retrigger the API
      queryClient.invalidateQueries({
        queryKey: ["movies", genre],
      });
      // show movie is deleted message
      notifications.show({
        title: "Movie Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="apart">
        <Title order={3} align="center">
          Movies
        </Title>
        <Button component={Link} to="/movie_add" color="yellow">
          Add New
        </Button>
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={genre}
          onChange={(event) => {
            setGenre(event.target.value);
          }}
        >
          <option value="">All Genres</option>
          {genreOptions.map((genre) => {
            return (
              <option key={genre} value={genre}>
                {genre}
              </option>
            );
          })}
        </select>
        <select
          value={rating}
          onChange={(event) => {
            setRating(event.target.value);
          }}
        >
          <option value="">All Rating</option>
          <option value="1">1</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {movies
          ? movies.map((movie) => {
              return (
                <Grid.Col key={movie._id} span={4}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{movie.title}</Title>
                    <Space h="20px" />
                    <Group position="center" spacing="5px">
                      <Badge color="green">{movie.director}</Badge>
                      <Badge color="yellow">{movie.genre}</Badge>
                      <Badge color="grape">{movie.rating}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/movies/" + movie._id}
                        color="blue"
                        size="xs"
                        radius="50px"
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          deleteMutation.mutate(movie._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Movies;
