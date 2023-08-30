import { useState, useEffect } from "react";
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
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filterMovie = async (genre = "") => {
    try {
      const response = await axios.get(
        "http://localhost:8080/movies?genre=" + genre
      );
      setMovies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMovieDelete = async (movie_id) => {
    try {
      // trigger API to delete from database
      await axios({
        method: "DELETE",
        url: "http://localhost:8080/movies/" + movie_id,
      });
      // method 1 (modify the state) - filter out the deleted movie
      notifications.show({
        title: "Movie Deleted",
        color: "green",
      });
      // method 2 (recall the api for movies again)
      // axios
      //   .get("http://localhost:8080/movies/")
      //   .then((response) => {
      //     setMovies(response.data);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      const newMovies = movies.filter((m) => m._id !== movie_id);
      setMovies(newMovies);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <Space h="20px" />
      <Group position="apart">
        <Title order={3} align="center">
          Movies
        </Title>
        {/* Method 1
         <Button component={Link} to="/movie_add" color="green">
          Add New
        </Button>  */}

        {/* Method 2 */}
        <Button
          color="yellow"
          onClick={() => {
            navigate("/movie_add");
          }}
        >
          Add New
        </Button>
      </Group>
      <Space h="20px" />
      <Group position="center">
        <Button
          onClick={() => {
            filterMovie("");
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            filterMovie("Drama");
          }}
        >
          Drama
        </Button>
        <Button
          onClick={() => {
            filterMovie("Fantasy");
          }}
        >
          Fantasy
        </Button>
        <Button
          onClick={() => {
            filterMovie("Action");
          }}
        >
          Action
        </Button>
        <Button
          onClick={() => {
            filterMovie("Sci-Fi");
          }}
        >
          Sci-fi
        </Button>
      </Group>
      <Space h="20px" />
      <Grid>
        {movies
          ? movies.map((movie) => {
              return (
                <Grid.Col span={4} key={movie._id}>
                  <Card align="center" withBorder shadow="md" p="20px">
                    <Title order={5}>{movie.title}</Title>
                    <Space h="10px" />
                    <Divider />
                    <Space h="10px" />
                    <Group position="center" spacing={2}>
                      <Badge color="dark">{movie.director}</Badge>
                      <Badge color="red">{movie.genre}</Badge>
                      <Badge>{movie.rating}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/movies/" + movie._id}
                        color="blue"
                        size="xs"
                        radius="5px"
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        radius="5px"
                        onClick={() => {
                          handleMovieDelete(movie._id);
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
