angular.module('starter.services', [])

.factory('Recipes', function() {
        return {
            all: function() {
                return recipes;
            },

            get: function(recipeId) {
                for (var i = 0; i < recipes.length; i++) {
                    if (recipes[i].id === parseInt(recipeId)) {
                        return recipes[i];
                    }
                }
                return null;
            }
        };
    })

.factory('Ultil', function() {
    return {
        emptyDataAvatarUser: function(data) {

            if (Array.isArray(data)) {
                for (i = 0; i < data.length; i++) {
                    if (data[i].recipe_user.imagem === null || data[i].recipe_user.imagem === undefined || data[i].recipe_user.imagem === 'undefined' || data[i].recipe_user.imagem === '') {
                        data[i].recipe_user.imagem = 'img/icon/avatar.png';
                    }
                }
            } else {
                if (data.recipe_user.imagem === null || data.recipe_user.imagem === undefined || data.recipe_user.imagem === 'undefined' || data.recipe_user.imagem === '') {
                    data.recipe_user.imagem = 'img/icon/avatar.png';
                }
            }
            return data;
        },

        emptyVal: function(data) {
            if (data != null && data != undefined && data != 'undefined' && data != '') {
                flag = false;
            } else {
                flag = true;
            }
            return flag;
        }
    }
})
