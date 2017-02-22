function onPressEnter(ev) {
	var searchText = document.getElementById("searchBox").value;
	var xhttp = new XMLHttpRequest(),
		filename = "https://graph.facebook.com/v2.8/search?q=",
		access_token = "EAAaMGUNe4XUBAKrKd1wG1dO6gGF2pzMzQn7em0hDXTaZC6EDtZAKiwEXF8Ydfo5neePB9jEDknflZBEYyE95xAQaVEWqRpU3CZAkNTiiEhRuV4ixR7eF31166fQ6KgIluRB3CAwG5iDBIh4KojlNggCeJ5is0E4ZD",
		pictureURL,
		image;
	
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Action to be performed when the document is read;
	       var response = JSON.parse(this.response).data;
	       debugger;
	       response.forEach(function(resultData){
	       	pictureURL = resultData.picture.data.url;
	       	document.getElementById("images").append("<img class='roll' src='" + pictureURL + "'>");
	       });
	    }
	};
	filename = filename+searchText+"&%20type=page&limit=9999&fields=id,name,about,category,company_overview,bio,picture,overall_star_rating&access_token="+access_token;
	xhttp.open("GET", filename, true);
	xhttp.send();
}
