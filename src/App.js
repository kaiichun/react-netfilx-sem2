import "./App.css";
import { Container, Title, Space } from "@mantine/core";
import Movies from "./Movies";
import Tvshow from "./TvShows";

function App() {
  return (
    <Container className="App">
      <Space h="50px" />
      <Title align="center" color="red">
        Netflix
      </Title>
      <Space h="20px" />
      <Title order={2} align="center">
        Enjoy big movies, hit series and more from RM17.
      </Title>
      <Space h="30px" />
      {/* list all the movies here */}
      <Movies />
      <Space h="20px" />
      <hr />
      <Space h="10px" />
      <Tvshow />
    </Container>
  );
}

export default App;
