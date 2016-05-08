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

.factory('Util', function(){
  return {
    emptyVal: function(data){
      if (data != null && data != undefined && data != 'undefined' && data != ''){
        flag = false;
      }else{
        flag = true;
      }
      return flag;
    }
  };
})
