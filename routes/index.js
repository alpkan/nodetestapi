const express = require('express');
const router = express.Router();
const NoSQL = require('nosql');
const path = require('path');
const db = NoSQL.load(path.join(__dirname, '../db.nosql'));
const { v4: uuidv4 } = require('uuid');

router.get('/url', function(req, res, next) {
  db.find().make(function(builder) {
    builder.callback(function(err, response) {
      res.json(response);
    });
  });
});

router.get('/url/:id', function(req, res, next) {
  db.find().make(function(builder) {
    builder.where('id', req.params.id);
    builder.callback(function(err, response) {
      if (response.length !== 0){
        res.json(response[0]);
      }
      else {
        res.send(404);
      }
    });
  });
});

router.delete('/url/:id', function(req, res, next) {
  db.remove().make(function(builder) {
    builder.where('id', req.params.id);
    builder.callback(function(err, count) {
      console.log('removed documents:', count);
      if (count !== 0){
        res.send(200);
      }
      else {
        res.send(404);
      }
    });
  });
});

router.post('/url', function(req, res, next) {
  if (!req.body.url || !req.body.title){
    res.send(400);
    return;
  }
  db.insert({ id: uuidv4(), title: req.body.title, data: { url: req.body.url, voteCount: 0 }, createdAt: new Date(), updatedAt: new Date() });
  res.send(201);
});

router.put('/url', function(req, res, next) {
  if (!req.body.url || !req.body.title || !req.body.voteCount || !req.headers.urlid){
    res.send(400);
    return;
  }
  db.modify({ title: req.body.title, data: { url: req.body.url, voteCount: req.body.voteCount }, updatedAt: new Date() }).make(function(builder) {
    builder.where('id', req.headers.urlid);
    builder.callback(function(err, count) {
      console.log('updated documents:', count);
      if (count === 0){
        res.send(404);
      }
      else {
        res.send(200);
      }
    });
  });
});

module.exports = router;
