angular.module('starter.controllers', [])


// LOGIN CONTROLLER
.controller('loginCtrl', function($scope, $cordovaCamera, $state, $stateParams, $ionicModal, Auth, $window, $ionicLoading, $http, $ionicPopup, Util) {

    var client = $window.localStorage['client'];
    if (!Util.emptyVal(client)) {
        $state.go('tab.timeline');
    }



    $scope.client = {};
    $scope.client.image                 = 'img/icon/icon-camera-upload.svg';

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

        var credentials = {
            email: $scope.client.email,
            password: $scope.client.password
        };

        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.login(credentials, config).then(function(user) {}, function(error) {
            console.log(error);
            $ionicPopup.alert({
                title: 'Erro!!!',
                template: 'Erro de Autenticação!'
            });
            $ionicLoading.hide();
        });

        $scope.$on('devise:login', function(event, currentUser) {
            // after a login, a hard refresh, a new tab
        });

        $scope.$on('devise:new-session', function(event, currentUser) {
            $window.localStorage['client'] = JSON.stringify(currentUser);
            $scope.modalEnterEmail.hide();
            $ionicLoading.hide();
            $state.go('tab.timeline');
        });
    };


    $scope.userLoginFacebook = function(result){

        alert(result.name)
        alert(result.email)

        $ionicLoading.show({template: 'Aguarde...'});
        var data = $.param({
            token_face: 'AaLKh%GAFSDUJ7734QAG8js9G$!$',
            name:result.name,
            email:result.email,
            picture:"https://graph.facebook.com/" + result.id + "/picture?type=large"
        });

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }




        var parameters = {
            token_face: 'AaLKh%GAFSDUJ7734QAG8js9G$!$',
            name:result.name,
            email:result.email,
            picture:"https://graph.facebook.com/" + result.id + "/picture?type=large"
        };

        var config = {
            params: parameters
        };

        $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
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











        $http.post('http://www.vegood.com.br/api/v1/vegood/login_facebook.json', data, config)
        .success(function(data, status, headers) {
            if ((typeof data.errors_user == "undefined") && data.flag_save_user.flag) { // DADOS PEGA
                $window.localStorage['user_token'] = JSON.stringify(data.user);
                $ionicLoading.hide();
                $state.go('app.person');
            } else if(!data.flag_save_user.flag) {
                var er = '';
                for (i = 0; i < data.errors_user.length; i++) {
                    er += data.errors_user[i].message + '<br>';
                }
                $ionicPopup.alert({
                    title: '',
                    template: er,
                    buttons: [{
                            text: 'ok',
                            type: 'button-calm',
                        }]
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
            userLoginFacebook(result);
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
                UserFacebook(result.authResponse.userID)
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

        var credentials = {
            name: $scope.client.name,
            email: $scope.client.email,
            statu_id: 1,
            password: $scope.client.password,
            password_confirmation: $scope.client.password_confirmation
        };

        console.log(credentials)

        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.register(credentials, config).then(function(registeredUser) {}, function(error) {
            console.log(error);
            message = '';
            if (typeof error.data.errors.name != 'undefined') {
                message += '<li>Email: ' + error.data.errors.name + '</li>'
            }
            if (typeof error.data.errors.email != 'undefined') {
                message += '<li>Email: ' + error.data.errors.email + '</li>'
            }
            if (typeof error.data.errors.password != 'undefined') {
                message += '<li>Senha: ' + error.data.errors.password + '</li>'
            }
            $ionicPopup.alert({
                title: 'Erro!!',
                template: message
            });
            $ionicLoading.hide();
        });

        $scope.$on('devise:new-registration', function(event, user) {
            $scope.modalEnterEmail.hide();
            $ionicLoading.hide();
            $scope.modalCreateAccount.hide();
            $scope.client = {};
            $ionicPopup.alert({
                title: 'Cadastro',
                template: 'Cadastro Realizado. Faça seu Login!!'
            });


            var config = {
                headers: {
                    'X-HTTP-Method-Override': 'DELETE'
                }
            };
            Auth.logout(config).then(function(oldUser) {
                // alert(oldUser.name + "you're signed out now.");
            }, function(error) {
                // An error occurred logging out.
            });
            $scope.$on('devise:logout', function(event, oldCurrentUser) {
                // ...
            });

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

    /* CRIANO USUARIO PELO FACEBOOK
     $scope.signInFacebook = function() {
    //     $scope.modalCreateAccount.hide();

    //     $cordovaFacebook.login(["public_profile", "email", "user_friends"])
    //     .then(function(success) {
    //       console.log("========>")
    //       console.log(success);
    //     }, function (error) {
    //       // error
    //     });

    //     Facebook.login(function(response) {
    //         if (response.status === 'connected') {
    //             $scope.user_cadastro = {};
    //             Facebook.api('/me?fields=name,email', function(response) {

    //                 $scope.user_cadastro.nome  = response.name;
    //                 $scope.user_cadastro.email = response.email;

    //                 Facebook.api('/me/picture?type=normal', function(response) {
    //                     $scope.user_cadastro.avatar = response.data;
    //                     var credentials = {
    //                         nome: $scope.user_cadastro.nome,
    //                         email: $scope.user_cadastro.email,
    //                         avatar: $scope.user_cadastro.avatar.url
    //                     };
    //                     credentials = JSON.stringify(credentials);
    //                     $http.post('https://vegood.filiperaiz.com.br/api/v1/home/tab/user/new.json', credentials)
    //                         .success(function(data, status, headers, config) {
    //                             if (data.user !== null && data.user !== undefined && data.user !== 'undefined' && data.user !== '') {
    //                                 $window.localStorage['token_user'] = JSON.stringify(data.user);
    //                                 $state.go('inicio');
    //                             } else {
    //                                  $state.go('login');
    //                             }
    //                     })
    //                     .error(function(data, status, header, config) {
    //                         $state.go('login');
    //                     });
    //                 });
    //             });
    //         }
    //     },{ scope: 'email' });


    //     $state.go('tab.home');
     }*/
})


// TIMELINE CONTROLLER
.controller('timeLineCtrl', function($state, $scope, $ionicModal, $http, $window, $ionicLoading, Util) {
    var client = $window.localStorage['client'];
    //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        $scope.hasMoreData  = true;
        $scope.page         = 1;
        client              = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            page:$scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
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

            $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
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

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
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
            $http.get('http://www.vegood.com.br/api/v1/vegood/like_recipe.json', config)
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

            $http.get('http://www.vegood.com.br/api/v1/vegood/favorite_recipe.json', config)
            .success(function(data, status, headers, config) {});
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

        $http.get('http://www.vegood.com.br/api/v1/vegood/recipe.json', config)
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
            //alert(recipe_id)
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
            $http.get('http://www.vegood.com.br/api/v1/vegood/like_recipe.json', config)
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

            $http.get('http://www.vegood.com.br/api/v1/vegood/favorite_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
    }

})


// PROFILE CONTROLLER
.controller('ProfileCtrl', function($scope, $stateParams, $http, Util, $window, $state, $ionicLoading) {
    var client = $window.localStorage['client'];

    //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
    if (!Util.emptyVal(client)) {
        $scope.hasMoreData  = true;
        $scope.page = 1;

        client    = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            perfil_id:$stateParams.clientId
        };

        var config = {
            params: parameters
        };

        $http.get('http://www.vegood.com.br/api/v1/vegood/get_perfil.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.perfil = data.perfil;
            }else{
                $window.localStorage.removeItem('client');
                //$ionicLoading.hide();
                $state.go('login');
            }
        });



        var parameters = {
            token_client:client.token,
            client_id:client.id,
            page:$scope.page,
            perfil_id:$stateParams.clientId
        };

        var config = {
            params: parameters
        };

        $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
        .success(function(data, status, headers, config) {
            if(data.client_logged.flag){
                $scope.list_recipes = data.list_recipes;
                $ionicLoading.hide();
            }else{
                $window.localStorage.removeItem('client');
                //$ionicLoading.hide();
                $state.go('login');
            }
        });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_client:client.token,
                client_id:client.id,
                page:$scope.page,
                perfil_id:$stateParams.clientId
            };

            var config = {
                params: parameters
            };

            $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes.json', config)
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
                //$ionicLoading.hide();
            })
        };

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
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
            $http.get('http://www.vegood.com.br/api/v1/vegood/like_recipe.json', config)
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

            $http.get('http://www.vegood.com.br/api/v1/vegood/favorite_recipe.json', config)
            .success(function(data, status, headers, config) {});
        }

        $scope.follow_func = function(recipe_id){
        }


    }else{
        $window.localStorage.removeItem('client');
        $ionicLoading.hide();
        $state.go('login');
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

        $http.get('http://www.vegood.com.br/api/v1/vegood/list_comments.json', config)
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

            $http.get('http://www.vegood.com.br/api/v1/vegood/list_comments.json', config)
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



        $scope.flagButton = true;
        $scope.enabledButton = function(){
            $scope.flagButton = false;
        }
        $scope.disableButton = function(){
            $scope.flagButton = true;
        }

        $scope.sendComment = function(){
            $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            var parameters = {
                token_client:client.token,
                client_id:client.id,
                recipe_id:$scope.recipe_id,
                text:$scope.text_comment
            };

            var config = {
                params: parameters
            };

            $http.get('http://www.vegood.com.br/api/v1/vegood/send_comment.json', config)
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
            })
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

        client    = JSON.parse(client);

        var parameters = {
            token_client:client.token,
            client_id:client.id
        };

        var config = {
            params: parameters
        };

        $http.get('http://www.vegood.com.br/api/v1/vegood/list_categories.json', config)
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

        var parameters = {
            token_client:client.token,
            client_id:client.id,
            category_id:$scope.category_id,
            page:$scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes_category.json', config)
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

            $http.get('http://www.vegood.com.br/api/v1/vegood/list_recipes_category.json', config)
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
        $scope.recipe.image                 = 'img/icon/icon-camera-upload.svg';
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
        $http.get('http://www.vegood.com.br/api/v1/vegood/list_categories.json', config)
        .success(function(data, status, headers, config) {
            $scope.list_categories = data.list_categories;
            //console.log($scope.list_categories)
        });


        $ionicLoading.hide($scope.list_categories);

        $scope.sendRecipe = function(){

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

            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://www.vegood.com.br/api/v1/vegood/send_recipe.json', parameters, config)
            .success(function(data, status, headers, config) {
                if(typeof data.errors_medication == "undefined"){
                    $state.go('timeline');
                }else{
                    var er = '';
                    for(i=0; i<data.errors_recipe.length;i++){
                        er+= data.errors_recipe[i].message+'<br>';
                    }
                    $ionicPopup.alert({
                     title: 'Erro!!!',
                     template: er
                   });
                }
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
.controller('ProfileFollowingCtrl', function($scope, $stateParams, Recipes, $http, Ultil, $state, $window, $rootScope) {
    $scope.perfis = [];
    $scope.pagePerfil = 1;

    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {
        $window.localStorage['token_user'] = JSON.stringify(data.user);

        //DADOS USUARIO LOGADO
        user = JSON.parse(user);
        $rootScope.usuario_logado_id = user.id


        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/perfil/seguindo/' + $stateParams.userId + '/pg/' + $scope.pagePerfil + '.json').success(function(response) {
            for (i = 0; i < response.lista_perfil_seguindo.length; i++) {
                $scope.perfis.push(response.lista_perfil_seguindo[i]);
            }
            $scope.perfis = Ultil.emptyDataAvatarUser($scope.perfis);
        })

        $scope.loadMore = function() {
            $scope.pagePerfil += 1;
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/perfil/seguindo/' + $stateParams.userId + '/pg/' + $scope.pagePerfil + '.json').success(function(response) {
                    for (i = 0; i < response.lista_perfil_seguindo.length; i++) {
                        $scope.perfis.push(response.lista_perfil_seguindo[i]);
                    }
                    $scope.perfis = Ultil.emptyDataAvatarUser($scope.perfis);
                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });

    } else {
        $state.go('login');
    }
})


// PROFILE FOLLOWERS CONTROLLER
.controller('ProfileFollowersCtrl', function($scope, $stateParams, Recipes, $http, Ultil, $state, $window, $rootScope) {
    $scope.perfis = [];
    $scope.pagePerfil = 1;

    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {

        //DADOS USUARIO LOGADO
        user = JSON.parse(user);
        $rootScope.usuario_logado_id = user.id


        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/perfil/seguidores/' + $stateParams.userId + '/pg/' + $scope.pagePerfil + '.json').success(function(response) {
            for (i = 0; i < response.lista_perfil_seguidores.length; i++) {
                $scope.perfis.push(response.lista_perfil_seguidores[i]);
            }

            $scope.perfis = Ultil.emptyDataAvatarUser($scope.perfis);
        })

        $scope.loadMore = function() {
            $scope.pagePerfil += 1;
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/perfil/seguidores/' + $stateParams.userId + '/pg/' + $scope.pagePerfil + '.json').success(function(response) {
                    for (i = 0; i < response.lista_perfil_seguidores.length; i++) {
                        $scope.perfis.push(response.lista_perfil_seguidores[i]);
                    }
                    $scope.perfis = Ultil.emptyDataAvatarUser($scope.perfis);
                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });

    } else {
        $state.go('login');
    }
})



// .controller('RecipeFavoritoCtrl', function($scope, $stateParams, Recipes, $timeout, $cordovaSocialSharing, $http, Ultil) {
//     $scope.recipes = [];
//     $scope.pageRecipe = 0;

//     $scope.loadMore = function() {
//         $scope.pageRecipe += 1;
//         $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/favoritos/' + $stateParams.userId + '/pg/' + $scope.pageRecipe + '.json').success(function(response) {
//                 for (i = 0; i < response.lista_receita_favoritas.length; i++) {
//                     $scope.recipes.push(response.lista_receita_favoritas[i]);
//                 }
//                 $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
//             })
//             .finally(function() {
//                 $scope.$broadcast('scroll.infiniteScrollComplete');
//             });
//     };

//     $scope.$on('$stateChangeSuccess', function() {
//         $scope.loadMore();
//     });
// })
