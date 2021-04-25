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
        let runSearch = function (keyword,divout) {
            let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword);//,'&page=1');
            fetch(url)
            .then((result)=>{
                return result.json();
            })
            .then((data)=>{
            	if (data.total_results==0)
            	{
					document.getElementById(divout).innerHTML = "Nothing to show";
            	} else {
                	document.getElementById(divout).innerHTML = null;
                    for (const [key, value] of Object.entries(data.results)) {
                        console.log(value);
                        var tag = document.createElement("h3");
                        var text = document.createTextNode(`${value.original_title}`);
                        tag.appendChild(text);
                        // var element = document.getElementById("output");
                        

                        var tag1 = document.createElement("img");
                        tag1.width = 300;
                        tag1.heigth = 450;
                        // var text = document.createTextNode(`${value.original_title}`);
                        if (value.poster_path){
                            tag1.src = 'https://image.tmdb.org/t/p/w500'+value.poster_path;
                        }
                        else{
                            tag1.src ='http://underscoremusic.co.uk/site/wp-content/uploads/2014/05/no-poster.jpg';
                        }

                        var tag2 =document.createElement("p");  
                        tag2.style.cssText = 'width:50vh;';
                        var overview = document.createTextNode(`${value.overview}`);
                        tag2.appendChild(overview);



                        var element = document.getElementById(divout);
                        element.appendChild(tag);
                        element.appendChild(tag1);
                        element.appendChild(tag2);
                     // document.getElementById('output').innerHTML = `<div><h3>${value.original_title} </h3> </div>`
                    }
                    //data.forEach(element => console.log(element));
               	}
                
            })
        }


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



        function showLoading(div) {
            document.getElementById(div).innerHTML = "loading";
        }

		function handleInput(val) {
			if(val.length < 2){
				document.getElementById('output').innerHTML = "more symbols needed";
				console.log(val.length );
			}else {
                showLoading('output');
                // document.getElementById('output').innerHTML = "loading";
                let deb = debounce(runSearch,2000);
                return deb(val,'output');
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