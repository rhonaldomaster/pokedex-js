'use strict';
var pokedexjs = (function () {
  var apiUrl = '//pokeapi.co/api/v2/', offset = 0, pageItems = 100,
    loadingImg = "<img src='img/loading.gif' class='loading-img'>";
  var $mainDiv;
  var itemTemplate,buttonTemplate,listTemplate,pokeDetailTemplate;
  function init(){
    $mainDiv = $('.js-main-div');
    $mainDiv
      .on('click','.js-view-detail',viewDetail)
      .on('click','.js-prev',prevPageListPokemon)
      .on('click','.js-next',nextPageListPokemon)
      .on('click','.js-back',showList);
    itemTemplate = Handlebars.compile($('.js-listpoke-item-template').html());
    buttonTemplate = Handlebars.compile($('.js-listpoke-template-button').html());
    listTemplate = Handlebars.compile($('.js-listpoke-template').html());
    pokeDetailTemplate = Handlebars.compile($('.js-poke-template').html());
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
      $.each(resp.results,function (idx,val) {
        id = idx+offset+1;
        listItems += itemTemplate({id: id, num: pad(id,3), name: val.name});
      });
      var buttons = (resp.previous!=null ? buttonTemplate({clase:'js-prev',texto:'Anterior'}) : '')
        + (resp.next!=null ? buttonTemplate({clase:'js-next',texto:'Siguiente'}) : '');
      var listpoke = listTemplate({items:listItems,buttons:buttons});
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
    var clickedElement = $(e.currentTarget);
    var num = clickedElement.data('poke-index');
    var url = apiUrl+'pokemon/'+num+'/';
    setTimeout(function () {
      var ajx = $.getJSON(url);
      $mainDiv.html(loadingImg);
      ajx.done(function (resp) {
        var pokemon = {
          id: num*1, num: pad(num,3), name: resp.name, types: resp.types.reverse(), weight: resp.weight/10,
          height: resp.height/10, abilities:resp.abilities, moves: resp.moves,
          atk:0, def:0, spatk:0, spdef:0, spd:0, hp:0
        };
        $.each(resp.stats,function (idx,val) {
          if(val.stat.name=='attack') pokemon.atk = val.base_stat;
          if(val.stat.name=='defense') pokemon.def = val.base_stat;
          if(val.stat.name=='special-attack') pokemon.spatk = val.base_stat;
          if(val.stat.name=='special-defense') pokemon.spdef = val.base_stat;
          if(val.stat.name=='speed') pokemon.spd = val.base_stat;
          if(val.stat.name=='hp') pokemon.hp = val.base_stat;
        });
        var html = pokeDetailTemplate(pokemon);
        $mainDiv.html(html);
      });
    },500);
  }

  return{
    init: init
  }
})();
pokedexjs.init();
