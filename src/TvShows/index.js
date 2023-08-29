import { useState, useEffect } from "react";
import axios from "axios";
import { Title, Grid, Card, Badge, Group, Space, Divider } from "@mantine/core";

function Tvshow() {
  const [tvshow, setTvshow] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/tvshows")
      .then((response) => {
        setTvshow(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Title order={3} align="center">
        TV Shows
      </Title>
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
