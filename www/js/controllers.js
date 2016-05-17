angular.module('starter.controllers', [])


// LOGIN CONTROLLER
.controller('loginCtrl', function($scope, $state, $stateParams, $ionicModal, Auth, $window, $ionicLoading, $http, $ionicPopup) {
    
    $scope.client = {};
    
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
        });
    };

    $scope.forgotPassword = function() {
        $scope.modalEnterEmail.hide();
        $state.go('forgot-password');
    };

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
            alert(recipe_id)
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
                recipe_id:$stateParams.recipeId
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
.controller('SendRecipeCtrl', function($scope, $cordovaCamera, $window, $rootScope, $http, $state) {

    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {

        //DADOS USUARIO LOGADO
        user = JSON.parse(user);
        $rootScope.usuario_logado_id = user.id;


        $scope.categorias = [
            { id: 1, text: 'Café da manhã' },
            { id: 2, text: 'Almoço' },
            { id: 3, text: 'Lanche' },
            { id: 4, text: 'Janta' }
        ];


        $scope.receita = {
            categorias: [],
            user_id: $rootScope.usuario_logado_id
        };

        $scope.receita.ingredientes = ['Ingrediente 1'];
        $scope.receita.modo_preparos = ['Modo de Preparo 1'];

        $scope.maisIngrediente = function() {
            $scope.receita.ingredientes.push('Ingrediente ' + ($scope.receita.ingredientes.length + 1));
        }

        $scope.maisModoPreparo = function() {
            $scope.receita.modo_preparos.push('Modo de Preparo ' + ($scope.receita.modo_preparos.length + 1));
        }

        $scope.enviarReceita = function() {

            data = JSON.stringify($scope.receita);
            console.log(data);

            $http.post('https://vegood.filiperaiz.com.br/api/v1/home/tab/enviarReceita.json', data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                })
                .error(function(data, status, header, config) {
                    $state.go('login');
                });
        }


        $scope.takePicture = function() {

            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
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
