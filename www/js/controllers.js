angular.module('starter.controllers', [])


// LOGIN CONTROLLER
.controller('loginCtrl', function($scope, $cordovaCamera, $state, $stateParams, $ionicModal, Auth, $window, $ionicLoading, $http, $ionicPopup, Util) {

    var client = $window.localStorage['client'];
    if (!Util.emptyVal(client)) {
        $state.go('tab.timeline');
    }



    $scope.client = {};
    $scope.client.image                 = 'img/icon-camera-upload.png';

    // MODAL CRIAÇÃO DE CONTA
    $ionicModal.fromTemplateUrl('templates/create-account.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalCreateAccount = modal;
    });

    $scope.openCreateAccount = function() {
        $scope.modalCreateAccount.show();
    };

    $scope.closeCreateAccount = function() {
        $scope.modalCreateAccount.hide();
    };

    // MODAL DE LOGIN
    $ionicModal.fromTemplateUrl('templates/enter-email.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalEnterEmail = modal;
    });

    $scope.openEnterEmail = function() {
        $scope.client = {};
        $scope.modalEnterEmail.show();
    };

    $scope.closeEnterEmail = function() {
        $scope.client = {};
        $scope.modalEnterEmail.hide();
    };


    //INICIALIZANDO LOGIN
    $scope.startLoginApp = function() {

        $ionicLoading.show({
            template: 'Aguarde...'
        });

        var parameters = $.param({
            email: $scope.client.email,
            password: $scope.client.password
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post('https://www.vegood.com.br/api/v1/vegood/login_client.json', parameters, config)
        .success(function(data, status, headers, config) {
            if(typeof data.errors_client == "undefined"){
                $window.localStorage['client'] = JSON.stringify(data.client);
                $scope.modalEnterEmail.hide();
                $ionicLoading.hide();
                $state.go('tab.timeline');
            }else{
                $ionicPopup.alert({
                    title: 'Erro!!!',
                    template: 'Erro de Autenticação!'
                });
                $ionicLoading.hide();
            }
        });
    };


    $scope.userLoginFacebook = function(result){

        $ionicLoading.show({template: 'Aguarde...'});

        var parameters = $.param({
            token_face: 'hGSdahbstuwpm7253xbshvHVHBDJ8t41fdhas97BMBCZGC5vhHVHXBCJ',
            name:result.name,
            email:result.email,
            facebook: 'facebook',
            picture:"https://graph.facebook.com/" + result.id + "/picture?type=large"
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }



        $http.post('https://www.vegood.com.br/api/v1/vegood/login_client.json', parameters, config)
        .success(function(data, status, headers) {

            g = JSON.stringify(data)
            alert(g)
            
            if(typeof data.errors_client == "undefined"){
                $window.localStorage['client'] = JSON.stringify(data.client);
                $scope.modalEnterEmail.hide();
                $ionicLoading.hide();
                $state.go('tab.timeline');
            }else{
                $ionicPopup.alert({
                    title: 'Erro!!!',
                    template: 'Erro de Autenticação!'
                });
                $ionicLoading.hide();
            }
        })
        .error(function(data, status, header, config) {
            $ionicPopup.alert({
                title: '',
                template: 'Tente mais tarde!!!',
                buttons: [{
                    text: 'ok',
                    type: 'button-calm',
                }]
            });
            $ionicLoading.hide();
        });
    }


    $scope.UserFacebook = function(user_id){
        facebookConnectPlugin.api(user_id+"/?fields=id,name,email", ["email"],
        function (result) {
            $scope.userLoginFacebook(result);
        },
        function (error) {
            $ionicPopup.alert({
                title: '',
                template: 'Tente mais tarde!!!',
                buttons: [{
                    text: 'ok',
                    type: 'button-calm',
                }]
            });
            $ionicLoading.hide();
        });
    }

    // LOGIN COM FACEBOOK
    $scope.signInFacebook = function(){
        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            facebookConnectPlugin.login(['public_profile', 'email'], function(result) {
                $scope.UserFacebook(result.authResponse.userID)
            }, function(error) {
                $ionicPopup.alert({
                    title: '',
                    template: 'Tente mais tarde!!!',
                    buttons: [{
                            text: 'ok',
                            type: 'button-calm',
                        }]
                });
                $ionicLoading.hide();
            });
        }
    };

    //CRIANO USUARIO
    $scope.startNewUser = function() {

        $ionicLoading.show({
            template: 'Aguarde...'
        });

        var parameters = $.param({
            name: $scope.client.name,
            email: $scope.client.email,
            statu_id: 1,
            password: $scope.client.password,
            password_confirmation: $scope.client.password_confirmation
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post('https://www.vegood.com.br/api/v1/vegood/create_client.json', parameters, config)
        .success(function(data, status, headers, config) {
            if(typeof data.errors_client == "undefined"){
                $scope.modalEnterEmail.hide();
                $ionicLoading.hide();
                $scope.modalCreateAccount.hide();
                $scope.client = {};
                $ionicPopup.alert({
                    title: 'Cadastro',
                    template: 'Cadastro Realizado. Faça seu Login!!'
                });
            }else{
                var er = '';
                for(i=0; i<data.errors_client.length;i++){
                    er+= data.errors_client[i].message+'<br>';
                }
                $ionicPopup.alert({
                 title: 'Erro!!!',
                 template: er
               });
            }
        });
    };

    $scope.forgotPassword = function() {
        $scope.modalEnterEmail.hide();
        $state.go('forgot-password');
    };

    $scope.takePhoto = function() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

       $cordovaCamera.getPicture(options).then(function(imageData) {
           $scope.recipe.image = "data:image/jpeg;base64," + imageData;
       }, function(err) {
           // An error occured. Show a message to the user
       });
    }

    $scope.choosePhoto = function() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.recipe.image = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
})

// LOGOFF
.controller('logoffCtrl', ['$state', '$window', 'Auth', function($state, $window, Auth) {
    alert("---")
    $window.localStorage.removeItem('client');
    $state.go('login');
}])

// TIMELINE CONTROLLER
.controller('timeLineCtrl', function($state, $scope, $ionicModal, $http, $window, $ionicLoading, Util) {
    var client = $window.localStorage['client'];
    //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        $scope.hasMoreData  = true;
        $scope.page         = 1;
        client              = JSON.parse(client);
        $scope.list_recipes = {};

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            page:$scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_recipes = data.list_recipes;
                //$ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    if(data.list_recipes.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_recipes.length; i++) {
                        $scope.list_recipes.push(data.list_recipes[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
                //$ionicLoading.hide();
            })
        };


        /************************************************/
        /*                  FUNCTIONS                   */
        /************************************************/
        $scope.like_func = function(recipe_id){
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:recipe_id
            };

            var config = {
                params: parameters
            };

            if($('#like-'+recipe_id+' i').attr('class')=='ion-ios-heart-outline'){
                $('#like-'+recipe_id+' i').removeClass('ion-ios-heart-outline');
                $('#like-'+recipe_id+' i').addClass('ion-ios-heart');
                val = parseInt($('#like-'+recipe_id+ ' t').html());
                $('#like-'+recipe_id+ ' t').html(val+1);
            }else{
                $('#like-'+recipe_id+' i').removeClass('ion-ios-heart');
                $('#like-'+recipe_id+' i').addClass('ion-ios-heart-outline');
                val = parseInt($('#like-'+recipe_id+ ' t').html());
                $('#like-'+recipe_id+ ' t').html(val-1);
            }
            $http.get('https://www.vegood.com.br/api/v1/vegood/like_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

        $scope.favorite_func = function(recipe_id){
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:recipe_id
            };

            var config = {
                params: parameters
            };

            if($('#favorite-'+recipe_id+' i').attr('class')=='ion-ios-star-outline'){
                $('#favorite-'+recipe_id+' i').removeClass('ion-ios-star-outline');
                $('#favorite-'+recipe_id+' i').addClass('ion-ios-star');
                val = parseInt($('#favorite-'+recipe_id+ ' t').html());
                $('#favorite-'+recipe_id+ ' t').html(val+1);
            }else{
                $('#favorite-'+recipe_id+' i').removeClass('ion-ios-star');
                $('#favorite-'+recipe_id+' i').addClass('ion-ios-star-outline');
                val = parseInt($('#favorite-'+recipe_id+ ' t').html());
                $('#favorite-'+recipe_id+ ' t').html(val-1);
            }

            $http.get('https://www.vegood.com.br/api/v1/vegood/favorite_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

        $scope.doRefresh = function(){
            $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    $scope.list_recipes = data.list_recipes;
                    $scope.$broadcast('scroll.refreshComplete');
                    //$ionicLoading.hide();
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });
        }

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// RECIPE DETAIL CONTROLLER
.controller('RecipeDetailCtrl', function($state, $scope, $stateParams, $http, Util, $window, $ionicLoading) {
    var client = $window.localStorage['client'];

    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        client    = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            recipe_id:$stateParams.recipeId
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/recipe.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.recipe = data.recipe;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

        /************************************************/
        /*                  FUNCTIONS                   */
        /************************************************/
        $scope.like_func = function(recipe_id){
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:recipe_id
            };

            var config = {
                params: parameters
            };

            if($('#like-'+recipe_id+' i').attr('class')=='ion-ios-heart-outline'){
                $('#like-'+recipe_id+' i').removeClass('ion-ios-heart-outline');
                $('#like-'+recipe_id+' i').addClass('ion-ios-heart');
                val = parseInt($('#like-'+recipe_id+ ' t').html());
                $('#like-'+recipe_id+ ' t').html(val+1);
            }else{
                $('#like-'+recipe_id+' i').removeClass('ion-ios-heart');
                $('#like-'+recipe_id+' i').addClass('ion-ios-heart-outline');
                val = parseInt($('#like-'+recipe_id+ ' t').html());
                $('#like-'+recipe_id+ ' t').html(val-1);
            }
            $http.get('https://www.vegood.com.br/api/v1/vegood/like_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

        $scope.favorite_func = function(recipe_id){
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:recipe_id
            };

            var config = {
                params: parameters
            };

            if($('#favorite-'+recipe_id+' i').attr('class')=='ion-ios-star-outline'){
                $('#favorite-'+recipe_id+' i').removeClass('ion-ios-star-outline');
                $('#favorite-'+recipe_id+' i').addClass('ion-ios-star');
                val = parseInt($('#favorite-'+recipe_id+ ' t').html());
                $('#favorite-'+recipe_id+ ' t').html(val+1);
            }else{
                $('#favorite-'+recipe_id+' i').removeClass('ion-ios-star');
                $('#favorite-'+recipe_id+' i').addClass('ion-ios-star-outline');
                val = parseInt($('#favorite-'+recipe_id+ ' t').html());
                $('#favorite-'+recipe_id+ ' t').html(val-1);
            }

            $http.get('https://www.vegood.com.br/api/v1/vegood/favorite_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// RECIPE DETAIL CONTROLLER
.controller('FavoriteCtrl', function($state, $scope, $stateParams, $http, Util, $window, $ionicLoading) {
    var client = $window.localStorage['client'];
    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        client    = JSON.parse(client);

        $scope.hasMoreData  = true;
        $scope.page         = 1;
        $scope.list_recipes = {};

        var parameters = {
            token_client:client.token,
            client_id:client.id
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes_favorites.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_recipes = data.list_recipes;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes_favorites.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    if(data.list_recipes.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_recipes.length; i++) {
                        $scope.list_recipes.push(data.list_recipes[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
                $ionicLoading.hide();
            })
        };

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// PROFILE CONTROLLER
.controller('ProfileCtrl', function($scope, $stateParams, $http, Util, $window, $state, $ionicLoading) {
    var client = $window.localStorage['client'];

    $scope.client = {};
    $scope.client.image                 = 'img/icon-camera-upload.png';
    $scope.perfil = {};
    $scope.list_recipes = {};

    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        $scope.hasMoreData  = true;
        $scope.page = 1;

        client    = JSON.parse(client);

        if (typeof $stateParams.clientId !== "undefined"){ // perfl de outro usuario
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page,
                perfil_id:$stateParams.clientId
            };
        }else{ // perfil do proprio usuario
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };
        }


        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/get_perfil.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.perfil       = data.perfil;
                $scope.list_recipes = data.list_recipes;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            if (typeof $stateParams.clientId !== "undefined"){ // perfl de outro usuario
                var parameters = {
                    token_client:client.token,
                    client_id:client.id,
                    page:$scope.page,
                    perfil_id:$stateParams.clientId
                };
            }else{ // perfil do proprio usuario
                var parameters = {
                    token_client:client.token,
                    client_id:client.id,
                    page:$scope.page
                };
            }

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/get_perfil.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    if(data.list_recipes.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_recipes.length; i++) {
                        $scope.list_recipes.push(data.list_recipes[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    //$ionicLoading.hide();
                    $state.go('login');
                }
                $ionicLoading.hide();
            })
        };


        /************************************************/
        /*                  FUNCTIONS                   */
        /************************************************/
        $scope.like_func = function(recipe_id){
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:recipe_id
            };

            var config = {
                params: parameters
            };

            if($('#like-'+recipe_id+' i').attr('class')=='ion-ios-heart-outline'){
                $('#like-'+recipe_id+' i').removeClass('ion-ios-heart-outline');
                $('#like-'+recipe_id+' i').addClass('ion-ios-heart');
                val = parseInt($('#like-'+recipe_id+ ' t').html());
                $('#like-'+recipe_id+ ' t').html(val+1);
            }else{
                $('#like-'+recipe_id+' i').removeClass('ion-ios-heart');
                $('#like-'+recipe_id+' i').addClass('ion-ios-heart-outline');
                val = parseInt($('#like-'+recipe_id+ ' t').html());
                $('#like-'+recipe_id+ ' t').html(val-1);
            }
            $http.get('https://www.vegood.com.br/api/v1/vegood/like_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

        $scope.favorite_func = function(recipe_id){
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:recipe_id
            };

            var config = {
                params: parameters
            };

            if($('#favorite-'+recipe_id+' i').attr('class')=='ion-ios-star-outline'){
                $('#favorite-'+recipe_id+' i').removeClass('ion-ios-star-outline');
                $('#favorite-'+recipe_id+' i').addClass('ion-ios-star');
                val = parseInt($('#favorite-'+recipe_id+ ' t').html());
                $('#favorite-'+recipe_id+ ' t').html(val+1);
            }else{
                $('#favorite-'+recipe_id+' i').removeClass('ion-ios-star');
                $('#favorite-'+recipe_id+' i').addClass('ion-ios-star-outline');
                val = parseInt($('#favorite-'+recipe_id+ ' t').html());
                $('#favorite-'+recipe_id+ ' t').html(val-1);
            }

            $http.get('https://www.vegood.com.br/api/v1/vegood/favorite_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

        $scope.follow_func = function(perfil_id){
            if($scope.perfil.flag_seguindo){
                $scope.perfil.flag_seguindo = false;

                if (typeof $stateParams.clientId !== "undefined"){
                    if($scope.perfil.size_followers>0){
                        $scope.perfil.size_followers=$scope.perfil.size_followers-1;
                    }
                }else{
                    if($scope.perfil.size_following>0){
                        $scope.perfil.size_following=$scope.perfil.size_following-1;
                    }
                }
            }else{
                $scope.perfil.flag_seguindo = true;
                if (typeof $stateParams.clientId !== "undefined"){
                    $scope.perfil.size_followers=$scope.perfil.size_followers+1;
                }else{
                    $scope.perfil.size_following=$scope.perfil.size_following+1;
                }
            }
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                perfil_id:$stateParams.clientId
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/following_create.json', config)
            .success(function(data, status, headers, config) {
                $scope.perfil.flag_seguindo = data.option_following.flag;
            })
            .error(function(data, status, header, config) {
                if($scope.perfil.flag_seguindo){
                    $scope.perfil.flag_seguindo = true;
                    if (typeof $stateParams.clientId !== "undefined"){
                        $scope.perfil.size_followers=$scope.perfil.size_followers+1;
                    }else{
                        $scope.perfil.size_following=$scope.perfil.size_following+1;
                    }
                }else{
                    $scope.perfil.flag_seguindo = false;
                    if (typeof $stateParams.clientId !== "undefined"){
                        if($scope.perfil.size_followers>0){
                            $scope.perfil.size_followers=$scope.perfil.size_followers-1;
                        }
                    }else{
                        if($scope.perfil.size_following>0){
                            $scope.perfil.size_following=$scope.perfil.size_following-1;
                        }
                    }
                }
            });
        }

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// EDITAR PROFILE
.controller('EditProfileCtrl', function($scope, $cordovaCamera, $stateParams, $http, Util, $window, $state, $ionicLoading, $ionicPopup) {
    var client = $window.localStorage['client'];

    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {

        client    = JSON.parse(client);
        $scope.perfil = {};
        $scope.perfil.image                 = 'img/icon-camera-upload.png';
        
        var parameters = {
            token_client:client.token,
            action: 'edit-profile',
            client_id:client.id
        };

        var config = {
            params: parameters
        };


        $http.get('https://www.vegood.com.br/api/v1/vegood/get_perfil.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.perfil       = data.perfil;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }


    $scope.updateClient = function(){
        $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
        var parameters = $.param({
            token_client:client.token,
            client_id:client.id,
            name:$scope.perfil.name,
            image: $scope.perfil.image,
            password: $scope.perfil.password,
            password_confirmation: $scope.perfil.password_confirmation
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post('https://www.vegood.com.br/api/v1/vegood/update_client.json', parameters, config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $window.localStorage['client'] = JSON.stringify(data.client);
                $ionicLoading.hide();
                
                if(typeof data.errors_client == "undefined"){
                    $state.go('tab.profile');
                }else{
                    var er = '';
                    for(i=0; i<data.errors_client.length;i++){
                        er+= data.errors_client[i].message+'<br>';
                    }
                    $ionicPopup.alert({
                     title: 'Erro!!!',
                     template: er
                   });
                }

            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        })
    }

    $scope.takePhoto = function() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

       $cordovaCamera.getPicture(options).then(function(imageData) {
           $scope.perfil.image = "data:image/jpeg;base64," + imageData;
       }, function(err) {
           // An error occured. Show a message to the user
       });
    }

    $scope.choosePhoto = function() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.perfil.image = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
})

// RECIPE COMMENTS CONTROLLER
.controller('RecipeCommentsCtrl', function($scope, $stateParams, $http, Util, $state, $window, $ionicLoading) {
    var client = $window.localStorage['client'];
    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {

        $scope.hasMoreData  = true;
        $scope.text_comment = '';
        $scope.list_comments = Array();

        $scope.page = 1;

        client    = JSON.parse(client);

        $scope.recipe_id = $stateParams.recipeId;

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            recipe_id:$scope.recipe_id
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/list_comments.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_comments = data.list_comments;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;


            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:$stateParams.recipeId,
                page:$scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/list_comments.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){

                    if(data.list_comments.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_comments.length; i++) {
                        $scope.list_comments.push(data.list_comments[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
                //$ionicLoading.hide();
            })
        };

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });

        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
              $ionicScrollDelegate.scrollBottom(true);
            }, 300);

          };

          $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
          };

          $scope.closeKeyboard = function() {
            // cordova.plugins.Keyboard.close();
          };


        $scope.flagButton = true;
        $scope.enabledButton = function(){
            $scope.flagButton = false;
        }
        $scope.disableButton = function(){
            $scope.flagButton = true;
        }

        $scope.sendComment = function(){
            $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
         
            var parameters = $.param({
                token_client:client.token,
                client_id:client.id,
                recipe_id:$scope.recipe_id,
                text:$scope.text_comment
            });

            //g = JSON.stringify(parameters)
            //alert(g)

            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('https://www.vegood.com.br/api/v1/vegood/send_comment.json', parameters, config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    $scope.list_comments.unshift(data.comment);
                    $scope.text_comment = '';
                    $ionicLoading.hide();
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });
        }

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// CATEGORY CONTROLLER
.controller('CategoryCtrl', function($scope, $stateParams, $http, Util, $state, $window, $ionicLoading) {
    var client = $window.localStorage['client'];
    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {

        $scope.list_categories = {};
        client    = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/list_categories.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_categories = data.list_categories;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });
    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// CATEGORY ITEMS CONTROLLER
.controller('CategoryItemsCtrl', function($scope, $stateParams, $http, Util, $state, $window, $ionicLoading) {
    var client = $window.localStorage['client'];
    //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {

        $scope.hasMoreData  = true;
        $scope.category_id  = $stateParams.categoryId;
        $scope.page         = 1;
        client              = JSON.parse(client);
        $scope.list_recipes = {};

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            category_id:$scope.category_id,
            page:$scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes_category.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_recipes = data.list_recipes;
                $scope.size_recipe = data.size_recipe;
                //$ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_client:client.token,
                client_id:client.id,
                category_id:$scope.category_id,
                page:$scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/list_recipes_category.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    $scope.size_recipe = data.size_recipe;
                    if(data.list_recipes.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_recipes.length; i++) {
                        $scope.list_recipes.push(data.list_recipes[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
                //$ionicLoading.hide();
            })
        };

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });


    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// SEND RECIPE CONTROLLER
.controller('SendRecipeCtrl', function($scope, $cordovaCamera, $window, $http, $state, Util, $ionicLoading, $ionicPopup) {
    var client = $window.localStorage['client'];
    if (!Util.emptyVal(client)) {

        $scope.recipe                       = {};
        $scope.recipe.image                 = 'img/icon-camera-upload.png';
        $scope.recipe.element_ingredient    = ['Ingrediente 1'];
        $scope.recipe.element_preparation   = ['Modo de preparo 1'];
        $scope.recipe.ingredients           = new Array();
        $scope.recipe.preparations          = new Array();


        client              = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id
        };

        var config = {
            params: parameters
        };

        $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
        $http.get('https://www.vegood.com.br/api/v1/vegood/list_categories.json', config)
        .success(function(data, status, headers, config) {
            $scope.list_categories = data.list_categories;
        });


        $ionicLoading.hide($scope.list_categories);

        $scope.sendRecipe = function(){
            $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            var categories   = new Array();
            for(i=0;i<$scope.list_categories.length;i++){
                if($scope.list_categories[i].checked){
                    categories.push($scope.list_categories[i].id);
                }
            }

            var parameters = $.param({
                token_client:client.token,
                client_id:client.id,
                title:$scope.recipe.name,
                category_ids:categories.toString(),
                image:$scope.recipe.image,
                ingredients:$scope.recipe.ingredients,
                preparations:$scope.recipe.preparations,
                portion:$scope.recipe.portion,
                preparation_time:$scope.recipe.preparation_time,
                dificulty:$scope.recipe.dificulty,
                cooking_time:$scope.recipe.cooking_time
            });

            console.log(parameters)

            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            
            $http.post('https://www.vegood.com.br/api/v1/vegood/send_recipe.json', parameters, config)
            .success(function(data, status, headers, config) {
                if(typeof data.errors_recipe === "undefined"){
                    $state.go('tab.timeline');
                    $ionicLoading.hide();
                }else{
                    var er = '';
                    for(i=0; i<data.errors_recipe.length;i++){
                        er+= data.errors_recipe[i].message+'<br>';
                    }
                    $ionicPopup.alert({
                        title: 'Erro!!!',
                        template: er
                    });
                    $ionicLoading.hide();
                }
            })
            .error(function(data, status, header, config) {
                $ionicPopup.alert({
                    title: '',
                    template: 'Tente mais tarde!!!',
                    buttons: [{
                        text: 'ok',
                        type: 'button-calm',
                    }]
                });
                $ionicLoading.hide();
            });
            
        }

        $scope.moreIngredient = function() {
            $scope.recipe.element_ingredient.push('Ingrediente ' + ($scope.recipe.element_ingredient.length + 1));
        }

        $scope.morePreparation = function() {
            $scope.recipe.element_preparation.push('Modo de preparo ' + ($scope.recipe.element_preparation.length + 1));
        }


        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

           $cordovaCamera.getPicture(options).then(function(imageData) {
               $scope.recipe.image = "data:image/jpeg;base64," + imageData;
           }, function(err) {
               // An error occured. Show a message to the user
           });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.recipe.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }


    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// PROFILE FOLLOWING CONTROLLER
.controller('ProfileFollowerCtrl', function($scope, $ionicLoading, $stateParams, $http, Util, $state, $window) {
    var client = $window.localStorage['client'];
    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        $scope.hasMoreData  = true;
        $scope.page         = 1;
        client              = JSON.parse(client);
        $scope.list_followers = {};

        if (typeof $stateParams.clientId !== "undefined"){ // perfl de outro usuario
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page,
                perfil_id:$stateParams.clientId
            };
        }else{ // perfil do proprio usuario
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };
        }

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/profile_followers.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_followers = data.list_followers;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/profile_followers.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    if(data.list_followers.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_followers.length; i++) {
                        $scope.list_followers.push(data.list_followers[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
                //$ionicLoading.hide();
            })
        };

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

// PROFILE FOLLOWING CONTROLLER
.controller('ProfileFollowingCtrl', function($scope, $ionicLoading, $stateParams, $http, Util, $state, $window) {
    var client = $window.localStorage['client'];
    $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        $scope.hasMoreData  = true;
        $scope.page         = 1;
        client              = JSON.parse(client);
        $scope.list_followings = {};


        if (typeof $stateParams.clientId !== "undefined"){ // perfl de outro usuario
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page,
                perfil_id:$stateParams.clientId
            };
        }else{ // perfil do proprio usuario
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };
        }

        var config = {
            params: parameters
        };


        $http.get('https://www.vegood.com.br/api/v1/vegood/profile_followings.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_followings = data.list_followings;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                $ionicLoading.hide();
                $state.go('login');
            }
        });

        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('https://www.vegood.com.br/api/v1/vegood/profile_followings.json', config)
            .success(function(data, status, headers, config) {
                if(data.client_logged.flag){
                    if(data.list_followings.length==0){
                        $scope.hasMoreData  = false;
                    }
                    for (i = 0; i < data.list_followings.length; i++) {
                        $scope.list_followings.push(data.list_followings[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $window.localStorage.removeItem('client');
                    $ionicLoading.hide();
                    $state.go('login');
                }
                //$ionicLoading.hide();
            })
        };

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('SettingsCtrl', function($scope, $state, $window, Util, $ionicLoading){
    var client = $window.localStorage['client'];
    if (!Util.emptyVal(client)) {
    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('AboutCtrl', function($state, $scope, $ionicModal, $http, $window, $ionicLoading, Util){
    var client = $window.localStorage['client'];
    //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {

        client    = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id
        };

        var config = {
            params: parameters
        };


        $http.get('https://www.vegood.com.br/api/v1/vegood/about.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $("#about").html(data.about.text);
            }else{
                //$window.localStorage.removeItem('client');
                //$ionicLoading.hide();
                $state.go('login');
            }
        });
    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('TermUseCtrl', function($state, $scope, $ionicModal, $http, $window, $ionicLoading, Util){
    var client = $window.localStorage['client'];
    //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {

        client    = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id
        };

        var config = {
            params: parameters
        };

        $http.get('https://www.vegood.com.br/api/v1/vegood/termuse.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $("#termuse").html(data.termuse.text);
            }else{
                //$window.localStorage.removeItem('client');
                //$ionicLoading.hide();
                $state.go('login');
            }
        });
    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('MenuFooterCtrl', function($scope, $state) {
    $scope.profile = function(){
        $state.go('tab.profile');
    }
    $scope.sendRecipe = function(){
        $state.go('tab.send-recipe');
    }
    $scope.category = function(){
        $state.go('tab.category');
    }
    $scope.timeline = function(){
        $state.go('tab.timeline');
    }
})
