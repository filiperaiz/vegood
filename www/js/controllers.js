angular.module('starter.controllers', [])


// LOGIN CONTROLLER
.controller('loginCtrl', function($scope, $state, $stateParams, $ionicModal, Auth, $window, $ionicLoading, $rootScope, $http, Ultil) {
    var flag_logado = false;
    var user = $window.localStorage['token_user'];

    if (!Ultil.emptyVal(user)) {
        user = JSON.parse(user);

        var data = JSON.stringify({ token: user.token, user_id: user.id });
        $http.post('http://vegood.filiperaiz.com.br/api/v1/home/tab/verifica_user.json', data)
            .success(function(data, status, headers, config) {
                if (!Ultil.emptyVal(user)) {
                    $window.localStorage['token_user'] = JSON.stringify(data.user);
                    flag_logado = true;
                }
            })
    }

    if (flag_logado) {
        $state.go('tab.home');
    }

    $scope.userLogin = {};
    $scope.userCadastro = {};

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
        $scope.modalEnterEmail.show();
    };

    $scope.closeEnterEmail = function() {
        $scope.modalEnterEmail.hide();
    };


    //INICIALIZANDO LOGIN
    $scope.startLoginApp = function() {

        $ionicLoading.show({
            template: 'Aguarde...'
        });

        var credentials = {
            email: $scope.userLogin.email,
            password: $scope.userLogin.password
        };

        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.login(credentials, config).then(function(user) {}, function(error) {
            alert('erro login');
            $ionicLoading.hide();
        });

        $scope.$on('devise:login', function(event, currentUser) {
            // after a login, a hard refresh, a new tab
        });

        $scope.$on('devise:new-session', function(event, currentUser) {
            $window.localStorage['token_user'] = JSON.stringify(currentUser);
            $scope.modalEnterEmail.hide();
            $ionicLoading.hide();
            $state.go('tab.home');
        });
    };

    //CRIANO USUARIO
    $scope.startNewUser = function() {
        var credentials = {
            nome: $scope.userCadastro.nome,
            email: $scope.userCadastro.email,
            statu_id: 1,
            password: $scope.userCadastro.password,
            password_confirmation: $scope.userCadastro.password
        };

        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.register(credentials, config).then(function(registeredUser) {}, function(error) {
            message = '';
            if (typeof error.data.errors.email != 'undefined') {
                message += '<li>Email: ' + error.data.errors.email + '</li>'
            }
            if (typeof error.data.errors.password != 'undefined') {
                message += '<li>Senha: ' + error.data.errors.password + '</li>'
            }
        });

        $scope.$on('devise:new-registration', function(event, user) {
            $window.localStorage['token_user'] = JSON.stringify(user);
            $scope.modalCreateAccount.hide();
            $state.go('inicio');
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
.controller('TimelineCtrl', function($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modal-search.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalSearch = modal;
    });

    $scope.openSearch = function() {
        $scope.modalSearch.show();
    };

    $scope.closeSearch = function() {
        $scope.modalSearch.hide();
    };
})


// RECIPE CONTROLLER
.controller('RecipeCtrl', function($scope, $stateParams, Recipes, $http, Ultil, $window, $state, $rootScope) {

    $scope.recipes = [];
    $scope.pageRecipe = 1;

    console.log('iiiiii');

    var el_link = String($window.location);

    if (el_link.indexOf('/perfis') == -1) {
        el_link = el_link.split("/tab/");
        el_link = el_link[el_link.length - 1].split('/');
        $scope.el_link = el_link[0] + '/';
    } else {
        $scope.el_link = '';
    }



    var user = $window.localStorage['token_user'];

    //DADOS USUARIO LOGADO
    user = JSON.parse(user);
    $rootScope.usuario_logado_id = user.id


    $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/userLogado/' + $rootScope.usuario_logado_id + '/receitas/pg/' + $scope.pageRecipe + '.json').success(function(response) {
        for (i = 0; i < response.lista_receitas.length; i++) {
            $scope.recipes.push(response.lista_receitas[i]);
        }
        $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
    });

    $scope.loadMore = function() {
        $scope.pageRecipe += 1;
        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/userLogado/' + $rootScope.usuario_logado_id + '/receitas/pg/' + $scope.pageRecipe + '.json').success(function(response) {
                for (i = 0; i < response.lista_receitas.length; i++) {
                    $scope.recipes.push(response.lista_receitas[i]);
                }
                $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
            })
            .finally(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });


    $scope.interact_recive = function(user_id, recive_id, type) {
        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/interact/' + recive_id + '/' + user_id + '/' + type + '.json').success(function(response) {
            if (type == 'like_dislike') {
                if (response.receita_interact.status == 'like') {
                    $('#like_dislike-' + recive_id).find('p').html('<i class="ion-ios-heart"></i>' + response.receita_interact.quant);
                } else if (response.receita_interact.status == 'dislike') {
                    $('#like_dislike-' + recive_id).find('p').html('<i class="ion-ios-heart-outline"></i>' + response.receita_interact.quant);
                }
            } else if (type == 'favorito_desfavorito') {
                if (response.receita_interact.status == 'favorito') {
                    $('#favorito_desfavorito-' + recive_id).find('p').html('<i class="ion-ios-star"></i>' + response.receita_interact.quant);
                } else if (response.receita_interact.status == 'desfavorito') {
                    $('#favorito_desfavorito-' + recive_id).find('p').html('<i class="ion-ios-star-outline"></i>' + response.receita_interact.quant);
                }
            }
        });
    }

    $scope.doRefresh = function() {
        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receitas/pg/1.json').success(function(response) {
                $scope.recipes = [];
                for (i = 0; i < response.lista_receitas.length; i++) {
                    $scope.recipes.push(response.lista_receitas[i]);
                }
                $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
})


// RECIPE DETAIL CONTROLLER
.controller('RecipeDetailCtrl', function($scope, $stateParams, Recipes, $timeout, $cordovaSocialSharing, $http, Ultil, $window, $state, $rootScope) {

    var el_link = String($window.location);

    if (el_link.indexOf('/perfis') == -1) {
        el_link = el_link.split("/tab/");
        el_link = el_link[el_link.length - 1].split('/');
        $scope.el_link = el_link[0] + '/';
    } else {
        $scope.el_link = '';
    }


    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {
        //DADOS USUARIO LOGADO
        user = JSON.parse(user);
        $rootScope.usuario_logado_id = user.id


        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/userLogado/' + $rootScope.usuario_logado_id + '/receitas/' + $stateParams.recipeId + '.json')
            .success(function(response) {
                $scope.recipe = response.receita;
                $scope.recipe = Ultil.emptyDataAvatarUser($scope.recipe);
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });

        $scope.interact_recive = function(user_id, recive_id, type) {
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/interact/' + recive_id + '/' + user_id + '/' + type + '.json').success(function(response) {
                if (type == 'like_dislike') {
                    if (response.receita_interact.status == 'like') {
                        $('body #like_dislike-' + recive_id).find('p').html('<i class="ion-ios-heart"></i>' + response.receita_interact.quant);
                    } else if (response.receita_interact.status == 'dislike') {
                        $('body #like_dislike-' + recive_id).find('p').html('<i class="ion-ios-heart-outline"></i>' + response.receita_interact.quant);
                    }
                } else if (type == 'favorito_desfavorito') {
                    if (response.receita_interact.status == 'favorito') {
                        $('body #favorito_desfavorito-' + recive_id).find('p').html('<i class="ion-ios-star"></i>' + response.receita_interact.quant);
                    } else if (response.receita_interact.status == 'desfavorito') {
                        $('body #favorito_desfavorito-' + recive_id).find('p').html('<i class="ion-ios-star-outline"></i>' + response.receita_interact.quant);
                    }
                }
            });
        }
    } else {
        $state.go('login');
    }
})


// RECIPE COMMENTS CONTROLLER
.controller('RecipeCommentsCtrl', function($scope, $stateParams, Recipes, $timeout, $cordovaSocialSharing, $http, Ultil, $state, $window, $rootScope) {
    $scope.comments = [];
    $scope.pageComents = 1;
    $scope.texto_comment = '';
    $scope.receita_comments_id = $stateParams.recipeId;
    $scope.buttonHab = true;


    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {
        //user = JSON.parse(user);
        //var data = JSON.stringify({token:user.token,user_id:user.id});
        //$http.post('https://vegood.filiperaiz.com.br/api/v1/home/tab/verifica_user.json', data)
        //    .success(function(data, status, headers, config) {
        //       if (data.user !== null && data.user !== undefined && data.user !== 'undefined' && data.user !== '') {
        //          $window.localStorage['token_user'] = JSON.stringify(data.user);

        //DADOS USUARIO LOGADO
        user = JSON.parse(user);
        $rootScope.usuario_logado_id = user.id



        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/comments/' + $stateParams.recipeId + '/pg/' + $scope.pageComents + '.json')
            .success(function(response) {
                for (i = 0; i < response.lista_comentarios.length; i++) {
                    $scope.comments.push(response.lista_comentarios[i]);
                }
                $scope.comments = Ultil.emptyDataAvatarUser($scope.comments);
            })


        $scope.loadMore = function() {
            $scope.pageComents += 1;
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/comments/' + $stateParams.recipeId + '/pg/' + $scope.pageComents + '.json').success(function(response) {
                    for (i = 0; i < response.lista_comentarios.length; i++) {
                        $scope.comments.push(response.lista_comentarios[i]);
                    }
                    $scope.comments = Ultil.emptyDataAvatarUser($scope.comments);
                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.enviarComentario = function(recive_id, user_id) {
            var data = JSON.stringify({
                texto_comentario: $scope.texto_comment,
                recive_id: recive_id,
                user_id: user_id
            });
            $http.post("http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/send_comment.json", data)
                .success(function(data, status) {
                    if (data.comment_status.flag) {
                        $scope.texto_comment = '';
                        $scope.buttonHab = true;
                        $scope.comments.unshift(data.comment);
                        $scope.comments = Ultil.emptyDataAvatarUser($scope.comments);
                    } else {
                        console.log('Erro');
                    }
                });
            return false;
        }

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });

        $scope.habilitaBotao = function() {
            $scope.buttonHab = false;
        }
        $scope.habilitaBotao2 = function() {
            if ($scope.texto_comment !== undefined && $scope.texto_comment !== '' && $scope.texto_comment.length > 0) {
                $scope.buttonHab = false;
            } else {
                $scope.buttonHab = true;
            }
        }

        //} else {
        //    $state.go('login');
        //}
        //})
        //.error(function(data, status, header, config) {
        //    $state.go('login');
        //});
    } else {
        $state.go('login');
    }
})

// CATEGORY CONTROLLER
.controller('CategoryCtrl', function($scope) {})


// CATEGORY ITEMS CONTROLLER
.controller('CategoryItemsCtrl', function($scope, $stateParams, Recipes, $timeout, $cordovaSocialSharing, $http, Ultil, $window, $rootScope, $state) {

    $scope.recipes = [];
    $scope.pageRecipe = 1;

    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {


        //DADOS USUARIO LOGADO
        user = JSON.parse(user);
        $rootScope.usuario_logado_id = user.id;


        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receitas/categoria/' + $stateParams.categoriaId + '/pg/' + $scope.pageRecipe + '.json').success(function(response) {
            $scope.quantidade = response.quantidade;
            for (i = 0; i < response.lista_receita_categorias.length; i++) {
                $scope.recipes.push(response.lista_receita_categorias[i]);
            }
            $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
        })



        $scope.loadMore = function() {
            $scope.pageRecipe += 1;

            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receitas/categoria/' + $stateParams.categoriaId + '/pg/' + $scope.pageRecipe + '.json').success(function(response) {
                    $scope.quantidade = response.quantidade;
                    for (i = 0; i < response.lista_receita_categorias.length; i++) {
                        $scope.recipes.push(response.lista_receita_categorias[i]);
                    }
                    $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
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


// PROFILE CONTROLLER
.controller('ProfileCtrl', function($scope, $stateParams, Recipes, $http, Ultil, $window, $rootScope, $state) {

    $scope.main = {
        show_list: 'perfil'
    };

    $scope.recipes = [];
    $scope.pageRecipe = 1;
    $scope.userId_params = $stateParams.userId;

    var el_link = String($window.location);

    if (el_link.indexOf('/perfis') == -1) {
        el_link = el_link.split("/tab/");
        el_link = el_link[el_link.length - 1].split('/');
        $scope.el_link = el_link[0] + '/';
    } else {
        $scope.el_link = '';
    }

    var user = $window.localStorage['token_user'];
    if (user != null && user != undefined && user != 'undefined' && user != '') {

        user = JSON.parse(user);
        var data = JSON.stringify({ token: user.token, user_id: user.id });

        if (user.id == $scope.userId_params) {
            $scope.flag_user_edt_seguir = true;
        } else {
            $scope.flag_user_edt_seguir = false;
        }


        //DADOS USUARIO LOGADO
        $rootScope.usuario_logado_id = user.id;


        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/perfil/' + $scope.userId_params + '/' + $rootScope.usuario_logado_id + '.json')
            .success(function(response) {
                $scope.perfil = response.perfil;
                $scope.flag_seguindo = response.flag_seguindo;
                $scope.perfil = Ultil.emptyDataAvatarUser($scope.perfil);
            });



        $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/userLogado/' + $rootScope.usuario_logado_id + '/receitas/user/' + $scope.userId_params + '/pg/' + $scope.pageRecipe + '.json')
            .success(function(response) {
                for (i = 0; i < response.lista_receitas.length; i++) {
                    $scope.recipes.push(response.lista_receitas[i]);
                }
                $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
            })



        $scope.loadMore = function() {
            $scope.pageRecipe += 1;
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/userLogado/' + $rootScope.usuario_logado_id + '/receitas/user/' + $scope.userId_params + '/pg/' + $scope.pageRecipe + '.json')
                .success(function(response) {
                    for (i = 0; i < response.lista_receitas.length; i++) {
                        $scope.recipes.push(response.lista_receitas[i]);
                    }
                    $scope.recipes = Ultil.emptyDataAvatarUser($scope.recipes);
                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };


        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });


        $scope.interact_recive = function(user_id, recive_id, type) {
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/receita/interact/' + recive_id + '/' + user_id + '/' + type + '.json')
                .success(function(response) {
                    if (type == 'like_dislike') {
                        if (response.receita_interact.status == 'like') {
                            $('.padding #like_dislike-' + recive_id).find('p').html('<i class="ion-ios-heart"></i>' + response.receita_interact.quant);
                        } else if (response.receita_interact.status == 'dislike') {
                            $('.padding #like_dislike-' + recive_id).find('p').html('<i class="ion-ios-heart-outline"></i>' + response.receita_interact.quant);
                        }
                    } else if (type == 'favorito_desfavorito') {
                        if (response.receita_interact.status == 'favorito') {
                            $('.padding #favorito_desfavorito-' + recive_id).find('p').html('<i class="ion-ios-star"></i>' + response.receita_interact.quant);
                        } else if (response.receita_interact.status == 'desfavorito') {
                            $('.padding #favorito_desfavorito-' + recive_id).find('p').html('<i class="ion-ios-star-outline"></i>' + response.receita_interact.quant);
                        }
                    }
                });
        }


        $scope.seguir = function(user_id, user_seguidor_id) {
            $http.get('http://vegood.filiperaiz.com.br/api/v1/home/tab/seguir/' + user_id + '/' + user_seguidor_id + '.json')
                .success(function(response) {
                    $scope.perfil = response.perfil;
                    $scope.flag_seguindo = response.flag_seguindo;
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
