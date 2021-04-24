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
                runSearch('aquamAn')
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
                    for (const [key, value] of Object.entries(data.results)) {
                        console.log(value);
                        var tag = document.createElement("h3");
                        var text = document.createTextNode(`${value.original_title}`);
                        tag.appendChild(text);
                        var element = document.getElementById("output");
                        element.appendChild(tag);
                     // document.getElementById('output').innerHTML = `<div><h3>${value.original_title} </h3> </div>`
                    }
                    //data.forEach(element => console.log(element));
               	}
                
            })
        }

        // function debounce(func, wait) {
        //     let timout = null;
        //     return (args) => {
        //         clearTimeout(timout)
        //         cancel = setTimeout(() => func(...args), wait)
        //     }
        // }

    function debounce(func, wait, immediate){
      var timeout, args, context, timestamp, result;
      if (null == wait) wait = 100;

      function later() {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };

      var debounced = function(){
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };

      debounced.clear = function() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
      
      debounced.flush = function() {
        if (timeout) {
          result = func.apply(context, args);
          context = args = null;
          
          clearTimeout(timeout);
          timeout = null;
        }
      };

      return debounced;
    };




        // function debounce(f, ms) {

        //   let isCooldown = false;

        //   return function() {
        //     if (isCooldown) return;

        //     f.apply(this, arguments);

        //     isCooldown = true;

        //     setTimeout(() => isCooldown = false, ms);
        //   };

        // }
		function handleInput(val) {
			if(val.length < 2){
				document.getElementById('output').innerHTML = "more symbols needed";
				console.log(val.length );
			}else {
                document.getElementById('output').innerHTML = "loading";
                let deb = debounce(runSearch,5000);
                console.log(typeof(deb));
                return deb(val);
  			   // return runSearch(val);
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