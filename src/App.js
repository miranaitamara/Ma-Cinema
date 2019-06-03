import React from 'react';
import logo from './logo.svg';
import moment from 'moment'
import { Button, Card, ListGroup, Nav, Navbar, Form, FormControl, NavDropdown, ButtonGroup, Row, Col } from 'react-bootstrap';
import Modal from 'react-modal';
import YouTube from '@u-wave/react-youtube';

import './App.css';
import { async } from 'q';
// import { async } from 'q';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      movies: [],
      genres: [],
      selectedView: 'now_playing',
      pageNumber: 1,
      searchText: '',
      hasSearched: false,
      popularity: 'popular',
      isOpen: false,
      selectedMovieId: null,
      allMovies: [],

    }
  }

  componentDidMount() {
    this.getData()
    this.getGenre()
  }
  getGenre  = async () => {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=1ba877ea9b60eed18e4a44c2cf42fc99')
    const jsonData = await response.json()
    console.log('json data', jsonData)
    const allGenres = jsonData.genres
    console.log('allgenres', allGenres)
    this.setState({
      genres: allGenres
    })
  }
  handleGenre(id) {
    let foo = this.state.allMovies.filter(movie => movie.genre_ids.includes(id))
    console.log(foo)
    this.setState({
      movies: foo,
    })
  }
  numberOfGenre(id) {
    let amountMovies =this.state.allMovies.filter(movie => movie.genre_ids.includes(id))
    let idd = amountMovies.length
    console.log('amount', idd)
    return idd
    
  }

  renderGenre() {
    return this.state.genres.map(({name, id})=>{
      return (
        <Button onClick={() => this.handleGenre(id)} variant="warning">{name}{this.numberOfGenre(id)}</Button>
      )
    })
  }
  getData = async () => {
    
    const { pageNumber, selectedView, popularity } = this.state
    const API_KEY = '1ba877ea9b60eed18e4a44c2cf42fc99';
    const response = await fetch(`https://api.themoviedb.org/3/movie/${selectedView}?api_key=${API_KEY}&language=en-US&page=${pageNumber}`)
    const jsonData = await response.json()

    const newState =
      this.setState({
        pageNumber: pageNumber + 1,
        movies: this.state.movies.concat(jsonData.results),
        allMovies: this.state.movies.concat(jsonData.results)
      }, () => console.log('second state', this.state))
  }

  sortMoviesAsc() {
    const movies = this.state.movies.sort((a, b) => {
      return b.popularity - a.popularity
    })
    this.setState({ movies })
  }

  sortMovieDesc() {
    const movies = this.state.movies.sort((a, b) => {
      return a.popularity - b.popularity
    })
    this.setState({ movies })
  }

  getMovies = userChoice => {
    this.setState({ movies: [], page: 1, selectedView: userChoice }, this.getData)
  }

  searchMovies = async () => {
    const { pageNumber, searchText, hasSearched } = this.state
    const API_KEY = '1ba877ea9b60eed18e4a44c2cf42fc99';
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}&page=${pageNumber - 1}`)
    const jsonData = await response.json()
    this.setState({
      movies: hasSearched ? this.state.movies.concat(jsonData.results) : jsonData.results,
      hasSearched: true,
      pageNumber: pageNumber + 1,
      searchText : ""
    })
  }

  getMoviePosterUrl(path) {
    return `https://image.tmdb.org/t/p/w500${path}`
  }

  renderMovies() {
    return this.state.movies.map(({
      title,
      release_date,
      overview,
      popularity,
      backdrop_path,
      vote_average,
      id,
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
              <ListGroup.Item style={{ fontSize: "20px", fontWeight: "bolder" }}>Popularity:  {Math.round(popularity)}</ListGroup.Item>

              <Button onClick={()=> this.getTrailer(id)} variant="warning">Watch Trailer</Button>
            </ListGroup>
          </Card.Body>
        </Card>
      )
    })
  }
  getTrailer = async(movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=1ba877ea9b60eed18e4a44c2cf42fc99`)
    const jsonData = await response.json()
    this.setState({
      isOpen: true,
      selectedMovieId: jsonData.results[0].key
    })
  }

  navbar() {
    return (
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Brand href="#home"><img src="img/imdb.png"></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => this.getMovies('top_rated')}>Top Rated</Nav.Link>
            <Nav.Link onClick={() => this.getMovies('now_playing')}>Now Playing</Nav.Link>
            <NavDropdown onClick={() => this.getMovies('popular')} title="Popular" id="nav-dropdown">
              <NavDropdown.Item onClick={() => this.sortMoviesAsc('popular')} eventKey="4.1">Most Popular</NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.sortMovieDesc()} eventKey="4.2">Least Popular</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Find Movies, TV Shows, Celebrities and More..." className="mr-sm-2" value={this.state.searchText} onChange={(e) => {
              this.setState({ searchText: e.target.value })
              console.log(e.target.value)
            }} />
            <Button variant="warning" onClick={this.searchMovies}>Search</Button>
           
            <Modal
                isOpen={this.state.isOpen}
                contentLabel ="Example Modal"
                onRequestClose={() => this.setState({isOpen: false})}
                >
            <YouTube
                video={this.state.selectedMovieId}
                autoplay
                height="100%"
                width="100%"

              />

            </Modal>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }
  
 

  moreMovieButton() {
    return <Button variant="warning" onClick={!this.state.hasSearched ? this.getData : () => this.searchMovies(this.state.hasSearched)}>More Movies!</Button>
  }

  render() {
    console.log(this.state)
    return (
      // <div>
      //   {this.navbar()}
      //   <div>
      //   <ButtonGroup>
      //   {this.renderGenre()}  
      //   </ButtonGroup> 
      //   </div>
      //   <div className="App">
      //     {this.renderMovies()}
      //   </div>
      //   <div style={{ display: "grid" }} >
      //     {this.moreMovieButton()}
      //   </div>
      // </div>
      
      <div>
  {this.navbar()}
  <div class="row">
    <div class="col-4">
      <ButtonGroup vertical>
        {this.renderGenre()}  
      </ButtonGroup> 
    </div>
    <div className="App" class="col-8">
        {this.renderMovies()}     
    </div>
  </div>
  <div style={{ display: "grid" }} >
      {this.moreMovieButton()}
  </div>
</div>

    );
  }
}
{/* <div className="App">
  {this.navbar()}
  <div class="row">
    <div class="col-8">
      <ButtonGroup>
        {this.renderGenre()}  
      </ButtonGroup> 
    </div>
    <div class="col-4">
        {this.renderMovies()}     
    </div>
    <div style={{ display: "grid" }} >
      {this.moreMovieButton()}
    </div>
  </div>
</div> */}
export default App;
