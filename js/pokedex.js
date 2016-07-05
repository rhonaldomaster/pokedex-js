'use strict';
var pokedexjs = (function () {
  var apiUrl = '//pokeapi.co/api/v2/', offset = 0, pageItems = 100,
    loadingImg = "<img src='img/loading.gif' class='loading-img'>";
  var $mainDiv;
  function init(){
    $mainDiv = $('.js-main-div');
    $mainDiv
      .on('click','.js-view-detail',viewDetail)
      .on('click','.js-prev',prevPageListPokemon)
      .on('click','.js-next',nextPageListPokemon)
      .on('click','.js-back',showList);
    listPokemon();
  }

  function showList(e) {
    e.preventDefault();
    listPokemon();
  }

  function listPokemon() {
    var url = apiUrl+'pokemon/?limit='+pageItems+'&offset='+offset;
    var ajx = $.getJSON(url);
    $mainDiv.html(loadingImg);
    ajx.done(function (resp) {
      var listItems = '', id = 0;
      var source = $('.js-listpoke-item-template').html();
      var template = Handlebars.compile(source);
      $.each(resp.results,function (idx,val) {
        id = idx+offset+1;
        listItems += template({id: id, num: pad(id), name: val.name});
      });
      source = $('.js-listpoke-template-button').html();
      template = Handlebars.compile(source);
      var buttons = (resp.previous!=null ? template({clase:'js-prev',texto:'Anterior'}) : '') + (resp.next!=null ? template({clase:'js-next',texto:'Siguiente'}) : '');
      source = $('.js-listpoke-template').html();
      template = Handlebars.compile(source);
      var listpoke = template({items:listItems,buttons:buttons});
      $mainDiv.html(listpoke);
    });
  }

  function nextPageListPokemon() {
    offset += pageItems;
    listPokemon();
  }

  function prevPageListPokemon() {
    offset -= pageItems;
    listPokemon();
  }

  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function viewDetail(e) {
    e.preventDefault();
    setTimeout(function () {
      var clickedElement = $(e.currentTarget);
      var num = clickedElement.data('poke-index');
      var url = apiUrl+'pokemon/'+num+'/';
      var ajx = $.getJSON(url);
      $mainDiv.html(loadingImg);
      ajx.done(function (resp) {
        var source = $('.js-poke-template').html();
        var template = Handlebars.compile(source);
        var html = template({
          id: num*1, num: pad(num,3), name: resp.name, types: resp.types.reverse(), weight: resp.weight/10,
          height: resp.height/10, abilities:resp.abilities, moves: resp.moves
        });
        $mainDiv.html(html);
      });
    },1000);

  }
  return{
    init: init
  }
})();
pokedexjs.init();
