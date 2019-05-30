import React from 'react';
import logo from './logo.svg';
import moment from 'moment'
import { Button, Card, ListGroup, Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import './App.css';
// import { async } from 'q';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      movies: [],
      genres: [],
      pageNumber: 1,
      searchText: '',
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const { pageNumber } = this.state
    const API_KEY = '1ba877ea9b60eed18e4a44c2cf42fc99';
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1${pageNumber}`)
    const jsonData = await response.json()
    const newState =
      this.setState({
        pageNumber: pageNumber + 1,
        movies: this.state.movies.concat(jsonData.results)
      }, () => console.log('second state', this.state))
  }
  searchMovies = async () => {
    const API_KEY = '1ba877ea9b60eed18e4a44c2cf42fc99';
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${this.state.searchText}&page=1`)
    const jsonData = await response.json()
    this.setState({
      movies: jsonData.results
    })
  }
  getMoviePosterUrl(path) {
    return `https://image.tmdb.org/t/p/w500${path}`
  }
  renderMovies() {
    return this.state.movies.map(({ title,
      release_date,
      overview,
      popularity,
      backdrop_path,
      vote_average
    }) => {
      return (

        <Card style={{ width: '25rem', display: "grid", padding: "0.30em 0.30em", margin: "0.5em" }}>
          <Card.Title style={{ fontSize: "2em", fontWeight: "bolder", minHeight: "3em" }}>{title}</Card.Title>
          <Card.Img variant="top" src={this.getMoviePosterUrl(backdrop_path)} />
          <Card.Body>
            <Card.Text style={{ overflowY: "scroll", height: "7em" }}>
              {overview}
            </Card.Text>
            <ListGroup>
              <ListGroup.Item style={{ fontSize: "20px", fontWeight: "bolder" }}>Time of Release:  {moment(release_date).fromNow()}</ListGroup.Item>
              <ListGroup.Item style={{ fontSize: "20px", fontWeight: "bolder" }}>Rating:  {vote_average}</ListGroup.Item>
              <Button variant="warning">Watch Trailer</Button>
            </ListGroup>
          </Card.Body>
        </Card>

      )
    })
  }

  navbar() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home"><img src="img/imdb.png"></img></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Actors</Nav.Link>
          <Nav.Link href="#pricing">Genres</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Find Movies, TV Shows, Celebrities and More..." className="mr-sm-2" value={this.state.searchText} onChange={(e) => {
            this.setState({ searchText: e.target.value })
            console.log(e.target.value)
          }} />
          <Button variant="warning" onClick={this.searchMovies}>Search</Button>
        </Form>
      </Navbar>
    )
  }
  render() {
    return (
      <div>
        {this.navbar()}
        <div className="App">
          {this.renderMovies()}
        </div>
        <div style={{ display: "grid" }} >
          <Button variant="warning" onClick={this.getData}>More Movies!</Button>
        </div>
      </div>
    );
  }
}
export default App;
