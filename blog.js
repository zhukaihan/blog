var tags = {};

function scrollToBody() {
	console.log("scrolling to body");
	$("html, body").animate({
		scrollTop: $("#body").offset().top
	}, 1000);
}

$(document).ready(function(){
	$(window).resize();

    showAllPostPreviews();
    var hash = decodeURI(window.location.hash);
    if (hash) {
        showPost(hash.substring(1, hash.length))
    }
});

$(window).resize(function(){
	if ($(this).width() < 1000) {
		$("#otherInfos").css("width", "90%");
		$("#content").css("width", "90%");
	} else {
		$("#otherInfos").css("width", "25%");
		$("#content").css("width", "60%");
	}
});

function showPostsPreviews(posts) {
	$("#shareLink").html("");
    if (posts != null) {
		// posts found
		$("#content").html("");
        for (i in posts) {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
					var info = JSON.parse(this.responseText);
		            if (info == null) {
		                return;
		            }

					var html = "";
		            html += "<div class=\"postPreview\" id=\"";
		            html += posts[i];
		            html += "\"><h1 class=\"postTitle\">";
		            html += info.title;
		            html += "</h1><p class=\"postTimestamp\">";
		            html += info.timestamp;
		            html += "</p><p class=\"postExtract\">";
		            html += info.extract;
		            html += "<a onclick=\"showPost('";
		            html += posts[i];
		            html += "')\"> Read more...</a></p><p class=\"postTag\">Tags: ";
		            for (j in info.tags) {
		                html += "<a onclick=\"showTagPostsPreviews('";
		                html += info.tags[j]
		                html += "'); scrollToBody()\">";
		                html += info.tags[j] + "</a>, ";

		                // add tags to tags
		                if (tags[info.tags[j]] == null) {
		                    tags[info.tags[j]] = [posts[i]];
		                } else {
		                    if ($.inArray(posts[i], tags[info.tags[j]]) == -1) {
		                        tags[info.tags[j]].push(posts[i]);
		                    }
		                }
		            }
		            html = html.substring(0, html.length - 2);
		            html += "</p></div>";

			        $("#content").append(html);
			    }
			};
            xhttp.open("GET", posts[i] + "/info.json", true);
            xhttp.send();
        }
    } else {
        // no posts
		$("#content").html("No Posts. ");
    }
}

function showAllPostPreviews() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			var posts = JSON.parse(this.responseText).posts;
			showPostsPreviews(posts);
		}
	};
    xhttp.open("GET", "postSum.json", true);
    xhttp.send();

}

function showTagPostsPreviews(tagName) {
	showPostsPreviews(tags[tagName]);
	$("#content").html("<h1>Tag: " + tagName + "</h1>" + $("#content").html());
}

function showPost(name) {
	var html = "";
	html = $("<div />").append($("#" + name).clone()).html();
	$("#content").html(html);
	$("#" + name + ">.postTitle").css("font-size", "40px");

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			if (this.responseText != null) {
				var escapedContent = this.responseText.replace(/&/g, "&amp;")
									.replace(/\n/g, "<br>")
									.replace(/        /g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
									.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
									//.replace(/</g, "&lt;")
									//.replace(/>/g, "&gt;")
									//.replace(/"/g, "&quot;")
									.replace(/'/g, "&apos;")
									;

				$("#content>#" + name + ">.postExtract").html("<article class='postContent'>"+ escapedContent + "</article>");
				$("#shareLink").html("http://blog.zhukaihan.com/index.html#" + name);
		    } else {
		        $("#content>#" + name + ">.postExtract").html("<p>No Such Article.</p>");
		    }
		}
	};
	xhttp.open("GET", name + "/content", true);
	xhttp.send();

	scrollToBody();
}
