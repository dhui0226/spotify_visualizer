import React, { useState, useEffect } from 'react';
import querystring from 'querystring'

function WebPlayback(props) {
    const { token } = props

    const [player, setPlayer] = useState(undefined);
    const [song, setSong] = useState('')

    const client_id = '40f5d6def80648d69693afd51ee9362d'
    const client_secret = '42e900f49b7a4aeaa9628538f8c39f09'
    const refresh_token = 'AQD4et_KQl2oTMRjjLoDlbFZ969reu7jmaUvlFqFUxZc7tH_IYxlfDXgVR58YsvjxRi2szw00ryyHkWa9D-EIDInzpKnsMjF68m5izfRvVetIV3u_RpiTWWMTlTfV4Q5oTs'
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
    
        /*const response = await fetch('/auth/song')
        const json = response.json()
        console.log('song', response)
        console.log('json', json)
        setSong({response})*/

    function refreshPage() {
        window.location.reload()
    }

    console.log('pw', token)

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

        /*async function getTing() {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                  Authorization: `Basic ${basic}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: querystring.stringify({
                  grant_type: 'refresh_token',
                  refresh_token,
                })
            });
            
            return response.json()
        }*/

        async function getSong() {
            //const access_token = await getTing()
            //console.log('access', access_token)

            const result = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })

            console.log('result', result)
            return result
        }
        
        async function getSongTwo() {
            const response = await getSong()
    
            if (response.status === 204 || response.status > 400) {
                console.log('not playing')
            }
            
            const spotSong = await response.json()
            console.log('song', spotSong)
            setSong(spotSong)
            console.log(song.item.id)
        }

        getSongTwo();

    }, []);

    return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    <button type="button" onClick={refreshPage}>Refresh</button>
                    <h1>{song.item.name}</h1>
                    <h2>{song.item.id}</h2>
                </div>
            </div>
        </>
    );
}

export default WebPlayback