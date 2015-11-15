var mongoose = require('mongoose'),
  async = require('async'),
  config = require('./config'),
  Schema = mongoose.Schema,
  Dummy,
  mongoosastic = require('../lib/mongoosastic');

var DummySchema = new Schema({
  text: String
});

DummySchema.plugin(mongoosastic);

Dummy = mongoose.model('Dummy', DummySchema);

describe('Truncate', function() {
  before(function(done) {
    mongoose.connect(config.mongoUrl, function() {
      Dummy.remove(function() {
        config.deleteIndexIfExists(['dummys'], function() {
          var dummies = [
            new Dummy({
              text: 'Text1'
            }),
            new Dummy({
              text: 'Text2'
            })
          ];
          async.forEach(dummies, function(item, cb) {
            item.save(cb);
          }, function() {
            setTimeout(done, config.INDEXING_TIMEOUT);
          });
        });
      });
    });
  });

  after(function(done) {
    Dummy.remove();
    Dummy.esClient.close();
    mongoose.disconnect();
    done();
  });
  
});
