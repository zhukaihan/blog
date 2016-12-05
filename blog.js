var tags = {};
var xhttp = new XMLHttpRequest();

function scrollToBody() {
	console.log("scrolling to body");
	$("html, body").animate({
		scrollTop: $("#body").offset().top
	}, 1000);
}

$(document).ready(function(){
	$(window).resize();
                  
    showAllPostPreviews();
    var hash = window.location.hash;
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
    if (posts != null) {
        var html = "";
        for (i in posts) {
            xhttp.open("GET", posts[i] + "/info.json", false);
            xhttp.send();
            var info = JSON.parse(xhttp.responseText);
            if (info == null) {
                continue;
            }
            
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
        }
        
        if (html != "") {
            $("#content").html(html);
        }
    } else {
        // no posts
    }
}

function showAllPostPreviews() {
    xhttp.open("GET", "postSum.json", false);
    xhttp.send();
    
    var posts = JSON.parse(xhttp.responseText).posts;
    showPostsPreviews(posts);
}

function showTagPostsPreviews(tagName) {
    showPostsPreviews(tags[tagName]);
}

function showPost(name) {
	var html = "";
	html = $("<div />").append($("#" + name).clone()).html();
	$("#content").html(html);
	$("#" + name + ">.postTitle").css("font-size", "40px");

	xhttp.open("GET", name + "/content", false);
	xhttp.send();
	if (xhttp.responseText != null) {
		var escapedContent = xhttp.responseText.replace(/&/g, "&amp;")
							.replace(/\n/g, "<br>")
							.replace(/        /g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
							.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
							//.replace(/</g, "&lt;")
							//.replace(/>/g, "&gt;")
							.replace(/"/g, "&quot;")
							.replace(/'/g, "&apos;")
							;

		$("#content>#" + name + ">.postExtract").html("<article class='postContent'>"+ escapedContent + "</article>");
		console.log(escapedContent);
    } else {
        $("#content>#" + name + ">.postExtract").html("<p>No Such Article.</p>");
    }
	scrollToBody();
}
