
var api_url = 'http://learningenglish.voanews.com/api/';

var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },
    logLevel: "info",              // Only "info" level messages will be logged
    verbose: true                  // log messages will be printed out to the console
});

var fs = require('fs');

casper.start().then(function() {
  var file_content = fs.read('api.xml');
  parser=new DOMParser();
  txt="<bookstore><book>";
  txt=txt+"<title>Everyday Italian</title>";
  txt=txt+"<author>Giada De Laurentiis</author>";
  txt=txt+"<year>2005</year>";
  txt=txt+"</book></bookstore>";
  console.log(txt);
  xmlDoc=parser.parseFromString(file_content,"text/xml");
  //http://www.w3schools.com/xml/xml_dom.asp
  console.log(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue);
  /*console.log(file_content);
  var xmlDoc = jQuery.parseXML( file_content );*/
    /*this.open(api_url, {
        method: 'get',
        headers: {
            'Accept': 'application/xml'
        }
    });*/
});


casper.run(function() {
    /*require('utils').dump(this.getPageContent());*/
    this.exit();
});