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
    var ref = new Firebase(FIREBASE_REF);

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
     * {array <object>} replied_posts
     *   {string} content
     *   {string | integer} message_id
     */
    $scope.posts = $firebaseArray(ref.child('posts'));

    $scope.sendMessage = function() {
      if (!$scope.message.user) {
        $scope.message.user = $scope.user;
      }

      $scope.message.created_at = _getTimestamp();

      if (!$scope.message.content) {
        console.log('message is empty');
      }

      $scope.messages.$add($scope.message)
        .then(function() {
          $scope.message.content = '';
        });

      // Parsing and creating question post
    };
  };

  mainCtrl.$inject = ['$scope', '$firebaseArray'];

  app.controller('mainCtrl', mainCtrl);
})();
