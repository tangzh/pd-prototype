(function() {
  'use strict';

  var FIREBASE_REF = 'https://dazzling-inferno-5729.firebaseio.com/';

  var app = angular.module('app', ['firebase']);

  var _generateUuid = function() {
    return (0|Math.random()*9e6).toString(30);
  };

  var _initUser = function() {
    return {
      username: 'user_' + _generateUuid()
    };
  };

  var _getTimestamp = function() {
    return parseInt(new Date().getTime());
  };

  var mainCtrl = function($scope, $firebaseArray) {
    var ref = new Firebase(FIREBASE_REF),
        QUESTION_REG = /^q#/,
        ANSWER_REG = /^ans_/,
        messageType = 0; // 1 for question, 2 for answer

    $scope.user = _initUser();

    /**
     * Message:
     * {string} content
     * {object} user
     *   {string} username
     */
    $scope.messages = $firebaseArray(ref.child('messages'));

    console.log($scope.messages);

    /**
     * Post
     * {string} content
     * {string | integer} message_id
     * {object} user
     * {array <object>} replied_posts
     *   {string} content
     *   {string | integer} message_id
     *   {object} user
     */
    $scope.posts = $firebaseArray(ref.child('posts'));

    $scope.sendMessage = function() {
      var questionId,
          repliedQuestion;

      if (!$scope.message.user) {
        $scope.message.user = $scope.user;
      }

      $scope.message.created_at = _getTimestamp();

      if (!$scope.message.content) {
        console.log('message is empty');
      }

      // Parsing and creating question post
      if ($scope.message.content.match(QUESTION_REG)) { // question
        $scope.message.content = $scope.message.content.replace(QUESTION_REG, '');
        messageType = 1;
      } else if ($scope.message.content.match(ANSWER_REG)) { // answer
        var params = $scope.message.content.split('#');
        $scope.message.content = params[1];
        questionId = params[0].replace(ANSWER_REG, '');
        messageType = 2;
      }

      $scope.messages.$add($scope.message)
        .then(function(ref) {
          if (messageType === 1) {
            $scope.posts.$add({
              message_id: ref.key(),
              content: $scope.message.content,
              created_at: _getTimestamp(),
              user: $scope.user,
              replied_posts: {}
            });
          } else if (messageType === 2) {
            repliedQuestion = _.find($scope.posts, function(p) {
              return p.$id === questionId;
            });
            console.log('repliedQuestion:', repliedQuestion);

            var uuid = _generateUuid();

            repliedQuestion.replied_posts = repliedQuestion.replied_posts || {};

            repliedQuestion.replied_posts[uuid] = {
              message_id: ref.key(),
              content: $scope.message.content,
              created_at: _getTimestamp(),
              user: $scope.user
            };

            $scope.posts.$save(repliedQuestion);
          }

          $scope.message = {};
        });

    };
  };

  mainCtrl.$inject = ['$scope', '$firebaseArray'];

  app.controller('mainCtrl', mainCtrl);
})();
