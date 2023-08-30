import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function TvShowEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [premiere_year, setPremiereYear] = useState("");
  const [end_year, setEndYear] = useState("");
  const [seasons, setSeasons] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:8080/tvshows/" + id)
      .then((response) => {
        // set value for every fields
        setTitle(response.data.title);
        setCreator(response.data.creator);
        setPremiereYear(response.data.premiere_year);
        setEndYear(response.data.end_year);
        setSeasons(response.data.seasons);
        setGenre(response.data.genre);
        setRating(response.data.rating);
      })
      .catch((error) => {
        notifications.show({
          title: error.response.data.message,
          color: "red",
        });
      });
  }, []);

  const handleUpdateTvShow = async (event) => {
    event.preventDefault();
    try {
      await axios({
        method: "PUT",
        url: "http://localhost:8080/tvshows/" + id,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          title: title,
          creator: creator,
          premiere_year: premiere_year,
          end_year: end_year,
          seasons: seasons,
          genre: genre,
          rating: rating,
        }),
      });
      // show add success message
      notifications.show({
        title: "TV Show Edited",
        color: "green",
      });
      // redirect back to home page
      navigate("/");
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Edit TV Show
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={title}
          placeholder="Enter the movie title here"
          label="Title"
          description="The title of the movie"
          withAsterisk
          onChange={(event) => setTitle(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={creator}
          placeholder="Enter the movie creator here"
          label="creator"
          description="The creator of the movie"
          withAsterisk
          onChange={(event) => setCreator(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={premiere_year}
          placeholder="Enter the TV Show Premiere Year here"
          label="PremiereYear"
          description="Premiere Year of the tvshow"
          withAsterisk
          onChange={setPremiereYear}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={end_year}
          placeholder="Enter the TV Show End Year here"
          label="End Year"
          description="End Year of the tvshow"
          withAsterisk
          onChange={setEndYear}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={seasons}
          placeholder="Enter the seasons here"
          label="Seasons"
          description="The Seasons of the movie"
          withAsterisk
          onChange={setSeasons}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={genre}
          placeholder="Enter the genre here"
          label="Genre"
          description="The genre of the movie"
          withAsterisk
          onChange={(event) => setGenre(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={rating}
          placeholder="Enter the rating here"
          label="Rating"
          min={1}
          max={10}
          precision={1}
          step={0.5}
          description="The rating of the movie"
          withAsterisk
          onChange={setRating}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleUpdateTvShow}>
          Update
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}
export default TvShowEdit;
