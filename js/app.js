/**
	An app using HTML,CSS and OOJS to search facebook pages
	using Facebook Graph API
**/
document.getElementById("searchBox").focus();
var pageSearchApp = {
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
			pagesContainer.innerHTML="<pre>\
										<h1>Ahhh...! You forgot to enter the page!!!</h1>\
										<h1>Please enter the page to be searched...</h1>\
									</pre>";
		}
	},
	/**
		Invoke during clicking of the card
	**/
	onClickCard : function(card){
		window.open("http://facebook.com/"+card.getAttribute("pageid"),"_blank");
	},
	/**
		A callback function for pageApi request
	**/
	pageCallbackFunction: function(event){
		var that            = this,
			pagesContainer  = document.getElementById("pagesContainer"),
			xhrResponse     = event.currentTarget,
			pictureURL, dom = "";

	   	if (xhrResponse.readyState == 4 && xhrResponse.status == 200) {
	      	// Action to be performed when the document is read;
	      	var response = JSON.parse(xhrResponse.response).data,
	      		dom      = "";
	      		
	      	if(response.length){
	      		response.forEach(function(resultData){
		      		var card = "";
			      	card+="<div class='card' pageId="+resultData.id+" onclick='pageSearchApp.onClickCard(this)'>";
		      			card+="<img src='" + resultData.picture.data.url + "'>";
		      			card+="<div class='card-body'>";
		      				card+="<h4><b>"+resultData.name+"</b></h4>";
		      				card+="<p>"+resultData.category+"</p>";
		      			card+="</div>";
			      	card+="</div>";
		      		dom+=card;
		      	});
		      	pagesContainer.innerHTML = dom;
	      	}
	      	else{
	      		pagesContainer.innerHTML = "<h1>Oops...No Pages Found!!!</h1>";
	      	}
	      	that.loaderUtil("none");
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
	}	
};
