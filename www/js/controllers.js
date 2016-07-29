angular.module('starter.controllers', ['ionic'])

  .controller('TranslinkCtrl', function ($scope, $http, $ionicLoading) {
    var base_api = 'http://api.translink.ca/rttiapi/v1/stops/';
    var api_key = '/estimates?apikey=sel49X4T9PbOg5xGRUdh&timeframe=1440';
    $scope.request = function (stopnumber) {
      $ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});
      var fullrequest = base_api + stopnumber + api_key;
      $http.defaults.headers.common.Accept = 'application/JSON';
      $http.get(fullrequest).then(function success(response) {
        $scope.rschedules = [];
        $scope.error = '';
        for (var i = 0; i < response.data.length; i++) {
          var routeno = response.data[i].RouteNo;
          var schedules = [];
          for (var j = 0; j < response.data[i].Schedules.length; j++) {
            var str = response.data[i].Schedules[j].ExpectedLeaveTime.toString();
            var res = str.split(" ");
            schedules.push(res[0]);
          }
          var rs = {
            'routeno': routeno,
            'schedules': schedules
          }
          $scope.rschedules.push(rs);
        }
        console.log($scope.rschedules);
      }, function error(response) {
        $scope.error = response;
      })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        })
    }
  })


  .controller('DashCtrl', function ($scope, $http, $ionicLoading) {
    // pie chart
    $scope.gauge_data = [{label: "Usage", value: 0, suffix: "%", color: "blue"}];
    $scope.gauge_options = {thickness: 5, mode: "gauge", total: 100};

    $scope.getStatus = function () {
      // Start showing the progress
      $ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});
      $http.get("http://ubcit.webi.it.ubc.ca/__shared/Pagelet5764.html")
        .then(function (response) {

          // convert to normal HTML
          var html = response.data;

          // parse by tag
          var div = document.createElement('div');
          div.innerHTML = html.toString();
          // ip
          var ip = div.getElementsByTagName('p')[0];
          ip = ip.textContent.split(":");
          $scope.ip = ip[1];
          // usage
          var usage = div.getElementsByTagName('p')[1];
          usage = usage.textContent.split(":");
          $scope.usage = usage[1];
          // current Status
          var currentstatus = div.getElementsByTagName('p')[2];
          currentstatus = currentstatus.textContent.split(":");
          $scope.currentstatus = currentstatus[1];
          // last updated
          var lastupdated = div.getElementsByTagName('p')[3];
          lastupdated = lastupdated.textContent.toString().trim().slice(13, lastupdated.length);
          $scope.lastupdated = lastupdated;
          var split = $scope.usage.split(', ');
          var inbound = split[0];
          var outbound = split[1];
          inbound = $scope.convert(inbound);
          outbound = $scope.convert(outbound);
          var percentage = inbound / 0.1;
          // pie chart
          $scope.gauge_data = [
            {label: "Usage", value: percentage.toFixed(2), suffix: "%", color: "blue"}
          ];
          $scope.gauge_options = {thickness: 5, mode: "gauge", total: 100};

        }, function (response) {
          $scope.using = "You are not using ResNet";
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
        });

    };
    $scope.convert = function (input) {
      if (input.indexOf("bytes") != -1) {
        var x = parseFloat(input);
        return x / 1000000000;
      } else if (input.indexOf("M") != -1) {
        var x = parseFloat(input);
        return x / 1000;
      } else if (input.indexOf("G") != -1) {
        var x = parseFloat(input);
        return x;
      }
    };

  })
  .controller('AccountCtrl', function ($scope) {
    $scope.menu = '';
    $scope.menus = [
      "홍대 불닭발",
      "주마 두부김치",
      "평화시장 닭똥집",
      "홍대 푸틴",
      "떡볶이",
      "닭알찜(계란찜)",
      "소등갈비구이",
      "시장 부추전",
      "토마토소스 계란말이",
      "성남 어징어 쫄면",
      "깻잎순대볶음",
      "옛날통닭",
      "파닭",
      "오징어 튀김",
      "부산 오뎅탕",
      "고추장찌개",
      "안산 고기비지찌개",
      "콩나물 국밥",
      "주먹밥",
      "부추튀김",
      "제육볶음",
      "춘천 닭갈비"
    ];
    $scope.exclude = function (item) {
      var i = $scope.menus.indexOf(item);
      delete $scope.menus[i];
      console.log($scope.menus);
    }
    $scope.random =function(){
      var i = Math.floor(Math.random() * ($scope.menus.length - 0 + 1) + 0);
      $scope.m = $scope.menus[i];
    }
  });
