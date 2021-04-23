/*
Add Search functionality to this page:
- use moviedb api for movie data, key is: 0adbb34bf81e230a73e19aaaeee72637 
    (https://www.themoviedb.org/documentation/api?language=en-US) ;
- list should be updated on the go (while user is typing), shortest search string is 3 characters;
- if search result is empty you need to show proper message, for example "Nothing to show”;
- you should visually reflect loading process, for example show "loading…” message or some loader gif

Important: 
- no redundant requests, use debounce or cancelation where appropriate. 
- use caching for previous requests
- no frameworks. Native (Vanilla) Javascript only.
*/ 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


  		let baseURL = 'https://api.themoviedb.org/3/';
        let configData = null;
        let baseImageURL = null;
        let APIKEY = '0adbb34bf81e230a73e19aaaeee72637';


        let getConfig = function () {
            let url = "".concat(baseURL, 'configuration?api_key=', APIKEY); 
            fetch(url)
            .then(result => {
			    if(result == 404){
			        document.getElementById("loading").style.display = 'none';   
			    }
			})
			.then(json => {
			    document.getElementById("loading").style.display = 'none';   
			})

            .then((result)=>{
                return result.json();
            })
            .then((data)=>{
                baseImageURL = data.images.secure_base_url;
                configData = data.images;
                console.log('config:', data);
                console.log('config fetched');
                runSearch(' ')
            })
            .catch(function(err){
               console.log(err);
            });
        }
        
        let runSearch = function (keyword) {
            let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword);
            fetch(url)
            .then((result)=>{
                if(result == 404){
                    document.getElementById("loading").style.display = 'none';   
                }
                return result.json();
            })
            .then((data)=>{
            	if (data.total_results==0)
            	{
					document.getElementById('output').innerHTML = "Nothing to show";
            	} else {
                	document.getElementById('output').innerHTML = JSON.stringify(data, null, 4);
               	}
                
            })
            .then(json => {
                document.getElementById("loading").style.display = 'none';   
            })
        }

		function search(val) {
			if(val.length < 2){
				document.getElementById('output').innerHTML = "at least 3 characters required ";
				console.log(val.length );
			}else {
  			   runSearch(val);
  			}
		}
        
        document.addEventListener('DOMContentLoaded', getConfig);
        /*******************************
        SAMPLE SEARCH RESULTS DATA
        { "vote_count": 2762, 
            "id": 578, 
            "video": false, 
            "vote_average": 7.5, 
            "title": "Jaws", 
            "popularity": 16.273358, 
            "poster_path": "/l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg", 
            "original_language": "en", 
            "original_title": "Jaws", 
            "genre_ids": [ 27, 53, 12 ], 
            "backdrop_path": "/slkPgAt1IQgxZXNrazEcOzhAK8f.jpg", 
            "adult": false, 
            "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.", 
            "release_date": "1975-06-18" 
        }
        *******************************/