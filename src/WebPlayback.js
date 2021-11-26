import React, { useState, useEffect } from 'react';

function WebPlayback(props) {
    const { token } = props

    const [player, setPlayer] = useState(undefined);
    const [song, setSong] = useState('')

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
    
            setPlayer(player);
    
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });
    
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
    
            player.connect();
        };

        async function getCurrentlyPlaying() {
            const result = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })

            return result
        }

        async function getSongInfo() {
            const response = await getCurrentlyPlaying()
    
            if (response.status === 204 || response.status > 400) {
                console.log('not playing')
            }
            
            const spotSong = await response.json()
            setSong(spotSong)

            console.log('song', spotSong)
        }

        getSongInfo()
    }, [])

    return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    <h1>{song.item.name}</h1>
                    <h2>{song.item.id}</h2>
                </div>
            </div>
        </>
    );
}

export default WebPlayback