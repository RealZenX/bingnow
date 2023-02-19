import React,{useEffect, useCallback} from 'react'
import useFetch from '../hooks/useFetch'
import CircularProgress from '@mui/material/CircularProgress';
import Watchlistitem from '../components/Watchlistitem'
import SnackbarExtended from '../../UI/SnackbarExtended';


type WatchlistType = {
    imdbId: string,
    title: string,
    poster: string,
    plot: string,
    runtime: string,
    year: string,
    genre: string,
    media: string,
    rerenderer?: (imdbId: string) => void,
}
const Watchlist:React.FC = () => {

    const [watchlist, setWatchlist] = React.useState<WatchlistType[]>([])
    const [open, setOpen] = React.useState<boolean>(false)
    const { isLoading: watchlistIsLoading, error: watchListError, data: watchListData} = useFetch({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
        },
        body: JSON.stringify({
            query: `
            query {
                watchlist(id:"${JSON.parse(localStorage.getItem('userId')!)}"){
                    imdbId
                    title
                    poster
                    plot
                    runtime
                    year
                    genre
                    media

                }
            }
            `            
        })
    }, 'query')

    useEffect(() => {
        if(watchListData){
            setWatchlist(watchListData.data.watchlist??[])
        }

        
    }, [watchListData])


    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }, []);
    const rerender = (imdbId:string) => {
        const watchlistArr = watchlist.filter((item:WatchlistType) => item.imdbId !== imdbId)
        setWatchlist(watchlistArr)
    }

    if(watchlistIsLoading){
        return <div className='flex justify-center h-full'><CircularProgress color='primary'/></div>
    }

    if(watchListError){
        return <SnackbarExtended severity='error' message='Something went wrong, please try again later.' open={open} handleClose={handleClose}/>
    }
    
    if(watchlist.length === 0){
        return <div className='flex flex-col items-center justify-center w-full h-screen'>
            <img src={require('../assets/watchlistempty.png')} width="300" className='mx-auto'/>
            <p className='text-2xl font-bold'>Ahoy! There's nothing in here.</p>
            </div>
    }
    return (
        <div>
                   
            <p className='self-start p-3 text-5xl font-bold'>My Watchlist</p>
            {watchListData && watchlist?.map((item:WatchlistType) => {
                return (
                    <Watchlistitem
                        key={item.imdbId}
                        imdbId={item.imdbId}
                        title={item.title}
                        poster={item.poster}
                        plot={item.plot}
                        runtime={item.runtime}
                        year={item.year}
                        rerenderer={rerender}
                        genre={item.genre}
                        media={item.media}
                        />
                )
            })}
        </div>
    )
}

export default Watchlist