'use strict';
var pokedexjs = (function () {
  var apiUrl = 'http://pokeapi.co/api/v2/', offset = 0, pageItems = 100,
    loadingImg = "<img src='img/loading.gif' class='loading-img'>";
  var $mainDiv;
  function init(){
    $mainDiv = $('.js-main-div');
    $mainDiv
      .on('click','.js-view-detail',viewDetail)
      .on('click','.js-listpoke-nav-prev',prevPageListPokemon)
      .on('click','.js-listpoke-nav-next',nextPageListPokemon)
      .on('click','.js-poke-details-back',listClick);
    listPokemon();
  }

  function listClick(e) {
    e.preventDefault();
    listPokemon();
  }

  function listPokemon() {
    var url = apiUrl+'pokemon/?limit='+pageItems+'&offset='+offset;
    var ajx = $.ajax({
      type:'get',
      url: url,
      dataType: 'json'
    });
    $mainDiv.html(loadingImg);
    ajx.done(function (resp) {
      var listItems = '';
      var source = $(".js-listpoke-item-template").html();
      var template = Handlebars.compile(source);
      $.each(resp.results,function (idx,val) {
        listItems += template({id:idx+offset+1, num: pad(idx+offset+1,3), name: val.name});
      });
      source = $(".js-listpoke-template-button").html();
      template = Handlebars.compile(source);
      var buttons = (offset>0 ? template({clase:'js-listpoke-nav-prev',texto:'Anterior'}):"") + template({clase:'js-listpoke-nav-next',texto:'Siguiente'});
      source = $(".js-listpoke-template").html();
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

  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  function viewDetail(e) {
    e.preventDefault();
    setTimeout(function () {
      var clickedElement = $(e.currentTarget);
      var num = clickedElement.data('poke-index');
      var url = apiUrl+'pokemon/'+num+'/';
      var ajx = $.ajax({
        type:'get',
        url: url,
        dataType: 'json'
      });
      $mainDiv.html(loadingImg);
      ajx.done(function (resp) {
        var source = $(".js-poke-template").html();
        var template = Handlebars.compile(source);
        var html = template({
          id: num*1, num: pad(num,3), name: resp.name, types: resp.types.reverse(), weight: resp.weight/10,
          height: resp.height/10, abilities:resp.abilities,
          moves: resp.moves
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
