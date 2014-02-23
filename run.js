
var api_url = 'http://learningenglish.voanews.com/api/';

var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },
    logLevel: "info",              // Only "info" level messages will be logged
    verbose: true                  // log messages will be printed out to the console
});

function log(message){
  console.log(message);
}

function getNodeValuebyTag( node, tag_name ){

  return node.getElementsByTagName(tag_name)[0].childNodes[0].nodeValue;
}

function getNodeAttribute( node, attribute ){
  return node[0].attributes.getNamedItem( attribute ).nodeValue;
}

var fs = require('fs');
var mapping_month ={
  'Jan': '01',
  'Feb': '02',
  'Mar': '03',
  'Jan': '04',
  'Apr': '05',
  'Jun': '06',
  'Jul': '07',
  'Aug': '08',
  'Sep': '09',
  'Oct': '10',
  'Nov': '11',
  'Dec': '12',
  'Jan': '01'
};

var result = [];



casper.start().then(function() {
  this.open(api_url, {
      method: 'get',
      headers: {
          'Accept': 'application/xml'
      }
  });
});

casper.then(function(){

  /*
  Read file from local for faster speed
  var file_content = fs.read('api.xml');*/

  parser=new DOMParser();
  
  xmlDoc=parser.parseFromString(this.getPageContent(),"text/xml");
  
  items = xmlDoc.getElementsByTagName("item");


  for ( var i=0; i < items.length; i++ ){
    var item = items[i];
    var title = getNodeValuebyTag( item, 'title' );
    var link = getNodeValuebyTag( item, 'link' );
    var pub_date = getNodeValuebyTag( item, 'pubDate' );
    var category = getNodeValuebyTag( item, 'category' );
    var enclosure = getNodeAttribute(item.getElementsByTagName('enclosure'), "url" );

    //Thu, 20 Feb 2014 00:30:30 +0000
    var arr_temp = pub_date.split(" ");
    //Expect output 2014-02-20
    var pub_date =  arr_temp[3] +'-' + mapping_month[arr_temp[2]] + '-' + arr_temp[1];

    result.push({
      title: title,
      link: link,
      category:category,
      pub_date: pub_date,
      enclosure:enclosure
    });
  }

  log("Total articles are " + result.length );
  fs.write('pre_data.txt', JSON.stringify(result), 'w');

});



casper.then(function(){
  if ( result.length == 0  ){
    log('Somethign went wrong,check your internet connection');
    return;
  }
  var index = -1; 
  this.eachThen(result, function() { 
    index++; 
    var article = result[index];
    casper.echo("Opening "+ article.link);
    this.thenOpen((article.link), function() {
      //this.echo(this.getTitle()); // display the title of page
      var bullet_orange = this.getElementsAttribute('ul.bullet_orange:last-child a','href');

      
      var audio_link = "http://learningenglish.voanews.com"  + bullet_orange[0];
      article.pdf_url = bullet_orange[2];

      this.thenOpen(audio_link,function(){
        var downloadlinkstatic = this.getElementsAttribute('li.downloadlinkstatic a','href');
        article.audio_link = downloadlinkstatic[1];

      });

      log(article.title);

    });
  });
});

casper.then(function(){
  log("Get all data done, now write to file");
  fs.write('data.txt', JSON.stringify(result), 'w');
})

casper.run(function() {
  this.exit();
});