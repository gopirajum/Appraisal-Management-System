var mongo_client = require('mongodb').MongoClient;

var putSelfScore = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('self_reviews');
      var peerCollection = db.collection('reviews');
      var peerScore=0;
      var n=0;
      peerCollection.find("submitted_by":details.submitted_by).toArray(function(err, items) {
        if(items){
          for(i in items){
            peerScore=peerScore+parseInt(items[i].score);
            n++;
          }
          peerScore=peerScore/n;
        }
          //console.log("in node servcie"+details.score);
        collection.update({"submitted_by":details.submitted_by}, { $set:{"peer_score":peerScore,"self_score":details.self_score}}, {w:1}, function(err, result) {
        var resultObj=JSON.parse(result);
        if(err||!(resultObj.n)) { 
          db.close();
          callback("not ok"); 
        } else {
          db.close();
          callback("ok");
        }
      }); 

        }

      });
      
    });
  };

  var doc={
    "submitted_by":"",
    "self_score":80
  };

  putSelfScore(doc,function(status){
    console.log(status);
  })