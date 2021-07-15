import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Navbar from '../Navbar'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

class Search extends Component {
  state = {isLoading: false, popularMovies: [], page: 1, query: ''}

  changeLeftPage = async () => {
    const {page} = this.state
    if (page !== 1) {
      await this.setState({page: page - 1, isLoading: true})
      this.getMovies()
    }
  }

  searchInput = value => {
    this.setState({query: value}, this.getMovies)
  }

  changeRightPage = async () => {
    const {page} = this.state
    if (page !== 20) {
      await this.setState({page: page + 1, isLoading: true})
      this.getMovies()
    }
  }

  getMovies = async () => {
    await this.setState({isLoading: true})
    const {page, query} = this.state
    const popularMoviesResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=3c6c6b15cf2c223e58665e8f0f8ac2e6&language=en-US&query=${query}&page=${page}`,
    )
    const popularMovies = await popularMoviesResponse.json()
    await this.setState({
      popularMovies: popularMovies.results,
      isLoading: false,
    })
  }

  renderSearchPage = () => (
    <div className="search-heading-container">
      <h1 className="search-heading">Search the movie name</h1>
    </div>
  )

  renderMoviesList = () => {
    const {popularMovies, page} = this.state
    return (
      <>
        <div className="popular-movies-list-container">
          <ul className="popular-movies-container">
            {popularMovies.map(each => {
              const movieImage = `https://image.tmdb.org/t/p/original/${each.poster_path}`
              return (
                <Link
                  to={`/movies/${page}/${each.id}`}
                  className="link"
                  key={each.id}
                >
                  <li key={each.id}>
                    <img
                      src={movieImage}
                      alt={each.original_title}
                      className="similar-movie-image"
                    />
                  </li>
                </Link>
              )
            })}
          </ul>
        </div>
        <div className="pages-paragraph pages-1">
          <p className="less-than" onClick={this.changeLeftPage}>
            {'<'}
          </p>{' '}
          <p> {page} of 20 </p>
          <p className="less-than" onClick={this.changeRightPage}>
            {'>'}
          </p>
        </div>
      </>
    )
  }

  renderLoading = () => (
    <div className="spinner-background">
      <Loader type="TailSpin" color="#D81F26" height={60} width={60} />
    </div>
  )

  renderNotfoundMovies = () => {
    const {query} = this.state
    return (
      <div className="search-heading-container">
        <h1 className="search-not-found-heading">
          Your search for {query} did not find any matches
        </h1>
      </div>
    )
  }

  renderSearchList = () => {
    const {popularMovies, isLoading} = this.state
    let result
    if (isLoading) {
      result = this.renderLoading()
    } else {
      result =
        popularMovies.length === 0
          ? this.renderNotfoundMovies()
          : this.renderMoviesList()
    }
    return result
  }

  renderPopularPage = () => {
    const {query} = this.state
    const isFilled = query === ''
    return (
      <div className="home-search-background">
        <Navbar searchInput={this.searchInput} />
        {isFilled ? this.renderSearchPage() : this.renderSearchList()}
      </div>
    )
  }

  render() {
    return <>{this.renderPopularPage()}</>
  }
}

export default Search
