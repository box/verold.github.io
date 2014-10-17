// You can get your username and user key from your Developer Portal
// You must have already created and compiled a bot before you can talk to it
var pb = new Pandorabot(
	"aiaas.pandorabots.com", 
	"1409611393853", 
	"Verold", 
	"6c0aaa9c8fd7d017287d876b6bf3f28e");
function doTalk() {
  var input = document.getElementById("yousay").value;
  document.getElementById("yousay").value = "";
  pb.talk(input, function(data) {
    var response = data["responses"];
    document.getElementById("response").innerHTML = response;
    console.log(response);
  });
}
