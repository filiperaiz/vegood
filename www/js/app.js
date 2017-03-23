angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'Devise', 'checklist-model'])


.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})




.config(function($stateProvider, $urlRouterProvider, AuthProvider, AuthInterceptProvider, $httpProvider, $ionicConfigProvider, $cordovaFacebookProvider) {

    var appID = 1726794000890259;
    var version = "v2.5"; // or leave blank and default is v2.0
    // $cordovaFacebookProvider.browserInit(appID, version);

    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.style('standard');
    $httpProvider.defaults.withCredentials = true;


    // DEVISE - www.vegood.com.br
    AuthProvider.loginMethod('POST');
    AuthProvider.loginPath('http://www.vegood.com.br/clients/sign_in.json');

    // Customize logout
    AuthProvider.logoutMethod('DELETE');
    AuthProvider.logoutPath('http://www.vegood.com.br/clients/sign_out.json');

    // Customize register
    AuthProvider.registerMethod('POST');
    AuthProvider.registerPath('http://www.vegood.com.br/clients.json');

    AuthProvider.resourceName('client');

    // Intercept 401 Unauthorized everywhere
    // Enables `devise:unauthorized` interceptor
    AuthInterceptProvider.interceptAuth(true);


    $stateProvider


    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'
    })

    .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'templates/forgot-password.html'
    })

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })


    // =============  TAB TIMELINE =============== //

    // timeline
    .state('tab.timeline', {
        url: '/timeline',
        cache: false,
        views: {
            'tab-timeline': {
                templateUrl: 'templates/tab-timeline.html'
            }
        }
    })

    // timeline > receita
    .state('tab.timeline-recipe-detail', {
        url: '/timeline/recipe/:recipeId',
        views: {
            'tab-timeline': {
                templateUrl: 'templates/recipe-detail.html'
            }
        }
    })

    // timeline > perfil
    .state('tab.timeline-profile', {
        url: '/timeline/profile/:clientId',
        views: {
            'tab-timeline': {
                templateUrl: 'templates/profile.html'
            }
        }
    })

    // timeline > item receita > comentarios
    .state('tab.timeline-item-recipe-comments', {
        url: '/timeline/comments/:recipeId',
        views: {
            'tab-timeline': {
                templateUrl: 'templates/comments.html'
            }
        }
    })

    // timeline > item receita > seguindo
    .state('tab.timeline-following', {
        url: '/timeline/following/:userId',
        views: {
            'tab-timeline': {
                templateUrl: 'templates/following.html',
                controller: 'ProfileFollowingCtrl'
            }
        }
    })

    // timeline > item receita > seguidores
    .state('tab.timeline-followers', {
        url: '/timeline/followers/:userId',
        views: {
            'tab-timeline': {
                templateUrl: 'templates/followers.html',
                controller: 'ProfileFollowersCtrl'
            }
        }
    })


    // =============  TAB CATEGORY =============== //

    // categorias
    .state('tab.category', {
        url: '/category',
        cache: false,
        views: {
            'tab-category': {
                templateUrl: 'templates/tab-category.html'
            }
        }
    })

    // categorias > itens
    .state('tab.category-items', {
        url: '/category/:categoryId',
        views: {
            'tab-category': {
                templateUrl: 'templates/category.html'
            }
        }
    })

    // categorias > destalhe receita
    .state('tab.category-recipe-detail', {
        url: '/category/recipe/:recipeId',
        views: {
            'tab-category': {
                templateUrl: 'templates/recipe-detail.html'
            }
        }
    })

    // categorias > perfil listagem de receitas
    .state('tab.category-profile', {
        url: '/category/profile/:userId',
        views: {
            'tab-category': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    // categorias > item receita > comentarios
    .state('tab.category-item-recipe-comments', {
        url: '/category/comentarios/:recipeId',
        views: {
            'tab-category': {
                templateUrl: 'templates/comments.html',
                controller: 'RecipeCommentsCtrl'
            }
        }
    })

    // categorias > item receita > seguindo
    .state('tab.category-following', {
        url: '/category/following/:userId',
        views: {
            'tab-category': {
                templateUrl: 'templates/following.html',
                controller: 'ProfileFollowingCtrl'
            }
        }
    })

    // categorias > item receita > seguidores
    .state('tab.category-followers', {
        url: '/category/followers/:userId',
        views: {
            'tab-category': {
                templateUrl: 'templates/followers.html',
                controller: 'ProfileFollowersCtrl'
            }
        }
    })




    // =============  TAB SEND RECIPE =============== //

    // enviar receita
    .state('tab.send-recipe', {
        url: '/send-recipe',
        cache: false,
        views: {
            'tab-send-recipe': {
                templateUrl: 'templates/tab-send-recipe.html'
            }
        }
    })




    // =============  TAB PROFILE =============== //

    // perfil

    .state('tab.profile', {
        url: '/profile',
        cache: false,
        views: {
            'tab-profile': {
                templateUrl: 'templates/tab-profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    // .state('tab.profile', {
    //     url: '/profile/:userId',
    //     views: {
    //         'tab-profile': {
    //             templateUrl: 'templates/profile.html',
    //             controller: 'ProfileCtrl'
    //         }
    //     }
    // })

    .state('tab.profile-settings', {
        url: '/settings',
        views: {
            'tab-profile': {
                templateUrl: 'templates/settings.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.profile-favorite', {
        url: '/favorite',
        views: {
            'tab-profile': {
                templateUrl: 'templates/favorite.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.profile-edit', {
        url: '/edit-profile',
        views: {
            'tab-profile': {
                templateUrl: 'templates/edit-profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.about', {
        url: '/about',
        views: {
            'tab-profile': {
                templateUrl: 'templates/about.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.term', {
        url: '/term',
        views: {
            'tab-profile': {
                templateUrl: 'templates/term.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.myths', {
        url: '/myths',
        views: {
            'tab-profile': {
                templateUrl: 'templates/myths.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.tips', {
        url: '/tips',
        views: {
            'tab-profile': {
                templateUrl: 'templates/tips.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    // perfis > destalhe receita
    .state('tab.profile-recipe-detail', {
        url: '/profile/recipe/:recipeId',
        views: {
            'tab-profile': {
                templateUrl: 'templates/recipe-detail.html',
                controller: 'RecipeDetailCtrl'
            }
        }
    })

    // perfis > item receita > comentarios
    .state('tab.profile-item-recipe-comments', {
        url: '/profile/comentarios/:recipeId',
        views: {
            'tab-profile': {
                templateUrl: 'templates/comments.html',
                controller: 'RecipeCommentsCtrl'
            }
        }
    })

    // perfis > item receita > seguindo
    .state('tab.profile-following', {
        // url: '/profile/following/:userId',
        url: '/profile/following',
        views: {
            'tab-profile': {
                templateUrl: 'templates/following.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    // perfis > item receita > seguidores
    .state('tab.profile-followers', {
        // url: '/profile/followers/:userId',
        url: '/profile/followers',
        views: {
            'tab-profile': {
                templateUrl: 'templates/followers.html',
                controller: 'ProfileCtrl'
            }
        }
    })



    // ==========  TELA INICIAL  ========== //
    $urlRouterProvider.otherwise('/login');

});
