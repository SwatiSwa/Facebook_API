/**
	An app using HTML,CSS and OOJS to search facebook pages
	using Facebook Graph API
**/
	var pageSearchApp = {
	   pagesStore : [],
	   favouriteStore : [],
	   loader  : document.getElementsByClassName("loader")[0],
		/**
			Invoked while pressing enter key on searchBox
		**/
	   onSearchFieldEnter : function(ev) {
			var that           = this,
				searchField    = document.getElementById("searchBox"),
				pagesContainer = document.getElementById("pagesContainer"),
				apiUrl         = "https://graph.facebook.com/v2.8/search?q=",
				access_token   = "EAAaMGUNe4XUBAKrKd1wG1dO6gGF2pzMzQn7em0hDXTaZC6EDtZAKiwEXF8Ydfo5neePB9jEDknflZBEYyE95xAQaVEWqRpU3CZAkNTiiEhRuV4ixR7eF31166fQ6KgIluRB3CAwG5iDBIh4KojlNggCeJ5is0E4ZD";

			if(searchField.value!=""){
				pagesContainer.innerHTML = "";
				apiUrl = apiUrl+searchField.value+"&type=page&limit=25&fields=id,name,about,category,company_overview,bio,picture,overall_star_rating&access_token="+access_token;
				that.loaderUtil("block");
				that.createAjaxRequest("GET",apiUrl,that.pageCallbackFunction);
			}
			else{
				pagesContainer.innerHTML = "<pre>\
					<h1>Oops...! You forgot to enter the page!!!</h1>\
					<h1>Please enter the page to be searched...</h1>\
				</pre>";
			}
		},
		/**
			Invoke during clicking of the card
		**/
		onClickCard : function(domElement,event){
			var star = document.getElementById("star");

			if(event.target.id!="star"){
				window.open("http://facebook.com/"+domElement.getAttribute("pageid"),"_blank");
			}

		},
		/**
			A callback function for pageApi request
		**/
		pageCallbackFunction: function(event){
			var that            = this,
				xhrResponse     = event.currentTarget;

		   	if (xhrResponse.readyState == 4 && xhrResponse.status == 200) {
		      	// Action to be performed when the document is read;
		      	var response = JSON.parse(xhrResponse.response).data;
		      		
		      	if(response.length){
		      		this.pagesStore = response;
		      		this.buildCardDom(response,"pagesContainer");
		      	}
		      	else{
		      		this.buildPageNotFoundDom("pagesContainer");	
		      	}
		      	that.loaderUtil("none");
		   }
		},
		buildCardDom : function(response,container){
			var that             = this,
				containerDom     = document.getElementById(container),
				pictureURL, dom = "";

			response.forEach(function(resultData){
	      		var card = "";
		      	card+="<div class='card' pageId="+resultData.id+" onclick='pageSearchApp.onClickCard(this,event)'>";
	      		card+="<div id='imgDiv'><img src='" + resultData.picture.data.url + "'></div>";
	      		card+="<div class='card-body'>";
	      		card+="<h4><b>"+resultData.name+"</b></h4>";
	      		card+="<p>";
	      		if(container!=="favouriteContainer"){
	      			card+="<i id='star' class='fa fa-star fa-1x zero-star' onclick='pageSearchApp.onClickFav(this,event)'></i>";	
	      		}
	      		card+=resultData.category+"</p>";
	      		card+="</div>";
	      		card+="<span class='tooltiptext'>"+resultData.name+"</span>";
		      	card+="</div>";
	      		dom+=card;
	      	});
	      	containerDom.innerHTML = dom;
		},
		buildPageNotFoundDom : function(container){
			var pagesContainer  = document.getElementById(container);

			pagesContainer.innerHTML = "<h1>Oops...No Pages Found!!!</h1>";
		},
		onClickFav : function(domElement,event){
			var pageId      = domElement.parentNode.parentNode.parentNode.getAttribute("pageid"),
				currentPage = this.pagesStore.filter(function(record){
   					return record.id == pageId;
				})[0];

			if(domElement.className.indexOf('full-star')>=0){
				domElement.className='fa fa-star fa-1x zero-star';
				if(currentPage){
					currentPage.favourite = false;
					this.favouriteStore.push(currentPage);
				}
			}
			else{
				domElement.className='fa fa-star fa-1x full-star';
				if(currentPage){
					currentPage.favourite = true;
					this.favouriteStore.push(currentPage);
				}
			}
		},
		/**
			An utility method for making Ajax calls
		**/
		createAjaxRequest : function(method,apiUrl,callbackFn){
			var xhttp = new XMLHttpRequest(),
				that  = this;	

			xhttp.open(method, apiUrl, true);
			xhttp.send();
			xhttp.onreadystatechange = callbackFn.bind(that);
		},
		/**
			An utility method for showing/hiding loader
		**/
		loaderUtil : function(mode){
			var that  = this;	

			this.loader.style.display = mode;
		},
		openPage : function(evt, tabName) {
	    	// Declare all variables
		    var i, tabcontent, tablinks;

		    // Get all elements with class="tabcontent" and hide them
		    tabcontent = document.getElementsByClassName("tabcontent");
		    for (i = 0; i < tabcontent.length; i++) {
		        tabcontent[i].style.display = "none";
		    }

		    // Get all elements with class="tablinks" and remove the class "active"
		    tablinks = document.getElementsByClassName("tablinks");
		    for (i = 0; i < tablinks.length; i++) {
		        tablinks[i].className = tablinks[i].className.replace(" active", "");
		    }

		    // Show the current tab, and add an "active" class to the link that opened the tab
		    document.getElementById(tabName).style.display = "block";
		    if(evt){
		    	evt.currentTarget.className += " active"
		    }
		    else{
		    	tablinks[0].className += " active";
		    }

		    if(tabName=="favouriteContainer"){
		    	var favouriteData = this.favouriteStore.filter(function(record){
		    		if(record.favourite){
		    			return true;
		    		}
		    	});
		    	this.buildCardDom(favouriteData,"favouriteContainer");
		    }
		}
	};
	document.getElementById("searchBox").focus();
	pageSearchApp.openPage(null,"pagesContainer");
