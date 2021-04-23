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



  		let baseURL = 'https://api.themoviedb.org/3/';
        let configData = null;
        let baseImageURL = null;
        let APIKEY = '0adbb34bf81e230a73e19aaaeee72637';


//at the begining
        let getConfig = function () {
            let url = "".concat(baseURL, 'configuration?api_key=', APIKEY); 
            fetch(url)
            .then(result => {
			    if(result == 404){
			        document.getElementById("wrong").style.display = 'none';   
			    }
			})
			.then(json => {
			    document.getElementById("wrong").style.display = 'none';   
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
        

        //search
        let runSearch = function (keyword) {
            let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword);
            fetch(url)
            .then((result)=>{
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
        }

        function debounce(func, wait) {
            let timout = null;
            return (args) => {
                clearTimeout(timout)
                cancel = setTimeout(() => func(...args), wait)
            }
        }
		function handleInput(val) {
			if(val.length < 2){
				document.getElementById('output').innerHTML = "more symbols needed";
				console.log(val.length );
			}else {
                document.getElementById('output').innerHTML = "loading";
                return debounce(runSearch(val),100)
  			}
		}



          const makeCancelable = (promise) => {
          let hasCanceled_ = false;

          const wrappedPromise = new Promise((resolve, reject) => {
            promise.then((val) =>
              hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
            );
            promise.catch((error) =>
              hasCanceled_ ? reject({isCanceled: true}) : reject(error)
            );
          });

          return {
            promise: wrappedPromise,
            cancel() {
              hasCanceled_ = true;
            },
          };
        };


        
        document.addEventListener('DOMContentLoaded', getConfig);