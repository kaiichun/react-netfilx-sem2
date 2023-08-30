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

function Tvshow() {
  const navigate = useNavigate();
  const [tvshow, setTvshow] = useState([]);
  // method 2 need add this
  const [tvshowAPI, setTvshowAPI] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/tvshows")
      .then((response) => {
        setTvshow(response.data);
        // method 2 need add this
        setTvshowAPI(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // method 1
  // const filterTvshow = async (genre = "") => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8080/tvshows?genre=" + genre
  //     );
  //     setTvshow(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //method 2
  const filterTvshow = async (genre) => {
    if (genre !== "") {
      const newTvshow = tvshowAPI.filter((tv) => tv.genre.includes(genre));
      setTvshow(newTvshow);
    } else {
      setTvshow(tvshowAPI);
    }
  };

  const handleTvShowDelete = async (tvshow_id) => {
    try {
      // trigger API to delete from database
      await axios({
        method: "DELETE",
        url: "http://localhost:8080/tvshows/" + tvshow_id,
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
      const newTvshow = tvshow.filter((t) => t._id !== tvshow_id);
      setTvshow(newTvshow);
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
          TV Shows
        </Title>
        {/* Method 1
         <Button component={Link} to="/movie_add" color="green">
          Add New
        </Button>  */}

        {/* Method 2 */}
        <Button
          color="yellow"
          onClick={() => {
            navigate("/tvshow_add");
          }}
        >
          Add New
        </Button>
      </Group>
      <Space h="20px" />
      <Group position="center">
        <Button
          onClick={() => {
            filterTvshow("");
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Drama");
          }}
        >
          Drama
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Fantasy");
          }}
        >
          Fantasy
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Action");
          }}
        >
          Action
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Crime");
          }}
        >
          Crime
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Adventure");
          }}
        >
          Adventure
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Biography");
          }}
        >
          Biography
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Horror");
          }}
        >
          Horror
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Sci-Fi");
          }}
        >
          Sci-Fi
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Comedy");
          }}
        >
          Comedy
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Mystery");
          }}
        >
          Mystery
        </Button>
        <Button
          onClick={() => {
            filterTvshow("Thriller");
          }}
        >
          Thriller
        </Button>
      </Group>
      <Space h="20px" />
      <Grid>
        {tvshow
          ? tvshow.map((tvshows) => {
              return (
                <Grid.Col span={4} key={tvshows._id}>
                  <Card align="center" withBorder shadow="md" p="20px">
                    <Title order={5}>{tvshows.title}</Title>
                    <Space h="10px" />
                    <Divider />
                    <Space h="10px" />
                    <Group position="center" spacing={2}>
                      <Badge color="dark">{tvshows.creator}</Badge>
                      {tvshows.genre.map((genre) => (
                        <Badge color="red" key={tvshows.genre}>
                          {genre}
                        </Badge>
                      ))}
                      <Badge>{tvshows.rating}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/tvshows/" + tvshows._id}
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
                          handleTvShowDelete(tvshows._id);
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

export default Tvshow;
