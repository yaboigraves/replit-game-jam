var txt = [];
var counts = {};
var keys = [];
var allwords = [];

var files = [ 'n2.txt', 'n1.txt', 'n3.txt', 'n4.txt', 'n5.txt'];

function preload() {
  // txt = loadStrings('/data/n1.txt')
  for(var i = 0; i < files.length; i++ ) {
//     txt[i] = loadStrings('/data/' + files[i]);
        txt[i] = loadStrings(files[i]);
    
  }
}

function setup() {
  
  // Adds all files together with a new line between them
  for(var i = 0; i < txt.length; i++ ){
    allwords[i] = txt[i].join("\n");
  }
  

  var tokens = allwords[0].split(/\W+/); // Filters to individual words for first document, is an object
  
  // Adds all words it finds from the target doc to dictionary 
  for(var i = 0; i < tokens.length; i++ ) {
    var word = tokens[i].toLowerCase();
    
    if(!/\d+/.test(word)) {
      if(counts[word] === undefined) {  
      counts[word] = {
        tf: 1,
        df: 1
      };
      keys.push(word);
      } else {
      counts[word].tf += 1;
      }
    }
  }

  // Searches through other documents for same information 
  var othercounts = [];
  for(var j = 1; j < allwords.length; j++ ) {
    var tempcounts = {};
    var tokens = allwords[j].split(/\W+/);
    
    for(var k = 0; k < tokens.length; k++ ) { 
      var w = tokens[k].toLowerCase();
      // If seen in another document, at least once, sets to seen
      if(tempcounts[w] === undefined) {
        tempcounts[w] = true;
      }
    }
    othercounts.push(tempcounts);
  }
  
  // Adds to document frequency 
  for(var i = 0; i < keys.length; i++ ) {
    var word = keys[i];
    for(var j = 0; j < othercounts.length; j++ ){
      var tempcounts = othercounts[j];
      if(tempcounts[word]) {
        counts[word].df++;
      }
    } 
  }

  // Math calculate weight of each the words 
  for(var i = 0; i < keys.length; i++) {
    var word = keys[i];

    var wordobj = counts[word];
    wordobj.tfidf = wordobj.tf * log(files.length / wordobj.df);
    
  }

  keys.sort(compare);

  // Sorts by weight- high to low
  function compare(a, b) {
    var countA = counts[a].tfidf;
    var countB = counts[b].tfidf;

    return countB - countA;
  }
  
  // To look at the dictionary
  for(var i = 0; i < keys.length; i++ ) {
    var key = keys[i];
    console.log(key + " " + counts[key].tfidf);
  }

}
